const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// uncomment for paid version of textbelt
// const TEXTBELT_API_KEY = '<YOUR_TEXTBELT_API_KEY>';

// API endpoint to send SMS
app.post('/send-sms', (req, res) => {
    const { numbers, message } = req.body;

    // Send SMS to each number in the list
    const sendSmsPromises = numbers.map(number => {
        return axios.post('https://textbelt.com/text', {
            phone: number,
            message: message,
            // key: TEXTBELT_API_KEY
        });
    });

    Promise.all(sendSmsPromises)
        .then(results => {
            results.forEach((result, index) => {
                if (result.data.success) {
                    console.log(`SMS sent to ${numbers[index]}`);
                } else {
                    console.error(`Error sending SMS to ${numbers[index]}: ${result.data.error}`);
                }
            });
            res.send('SMS sent successfully');
        })
        .catch(err => {
            console.error('Error sending SMS:', err.message);
            res.status(500).send('Error sending SMS');
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
