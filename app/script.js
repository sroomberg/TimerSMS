document.addEventListener('DOMContentLoaded', function () {
    const smsForm = document.getElementById('smsForm');
    const status = document.getElementById('status');

    smsForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(smsForm);
        const numbers = formData.get('numbers').split(',').map(number => number.trim());
        const message = formData.get('message');
        const duration = formData.get('duration');

        // Make sure numbers and message are not empty
        if (numbers.length === 0 || !message) {
            status.textContent = 'Please enter phone numbers and message';
            return;
        }

        // Send SMS via AJAX
        sendSMS(numbers, message, duration);
    });

    function sendSMS(numbers, message, duration) {
        fetch('/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numbers: numbers,
                message: message
            })
        })
            .then(response => {
                if (response.ok) {
                    status.textContent = 'SMS sent successfully';
                    setTimeout(function() {
                        status.textContent = '';
                    }, duration * 1000); // Clear status message after timer duration
                } else {
                    status.textContent = 'Error sending SMS';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                status.textContent = 'Error sending SMS';
            });
    }
});
