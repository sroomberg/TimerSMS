const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const client = twilio('<TWILIO_ACCOUNT_SID>', '<TWILIO_AUTH_TOKEN>');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API endpoint to send SMS
app.post('/send-sms', (req, res) => {
    const { numbers, message } = req.body;

    // Send SMS to each number in the list
    numbers.forEach(number => {
        client.messages.create({
            body: message,
            to: number,
            from: '<TWILIO_PHONE_NUMBER>'
        }).then(message => console.log(`SMS sent to ${number}`))
            .catch(err => console.error(`Error sending SMS to ${number}: ${err.message}`));
    });

    res.send('SMS sent successfully');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
