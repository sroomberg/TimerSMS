# variables
variable "aws_region" {
  description = "The AWS region to deploy in"
  default     = "us-west-2"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "key_name" {
  description = "EC2 key pair name"
}

variable "textbelt_api_key" {
  description = "Textbelt API Key"
  default     = ""
}


# main template
provider "aws" {
  region = var.aws_region
}

resource "aws_instance" "app_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Amazon Linux 2 AMI
  instance_type = var.instance_type
  key_name      = var.key_name

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y git
              curl -sL https://rpm.nodesource.com/setup_14.x | bash -
              yum install -y nodejs
              yum install -y nginx

              # Clone the application repository
              git clone https://github.com/sroomberg/TimerSMS.git /home/ec2-user/timer-sms
              cd /home/ec2-user/timer-sms

              # Install dependencies
              npm install

              # Create environment variables file
              echo "TEXTBELT_API_KEY=${var.textbelt_api_key}" >> .env

              # Start the application
              node server.js &

              # Configure nginx
              echo 'server {
                listen 80;
                server_name _;
                location / {
                  proxy_pass http://localhost:3000;
                  proxy_http_version 1.1;
                  proxy_set_header Upgrade $http_upgrade;
                  proxy_set_header Connection "upgrade";
                  proxy_set_header Host $host;
                  proxy_cache_bypass $http_upgrade;
                }
              }' > /etc/nginx/conf.d/timer-sms.conf

              systemctl restart nginx
              EOF

  tags = {
    Name = "timer-sms-server"
  }
}


# outputs
output "instance_public_ip" {
  description = "Public IP"
  value       = aws_instance.app_server.public_ip
}
