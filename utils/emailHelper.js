// utils/emailHelper.js
const nodemailer = require('nodemailer');

// Function to send email notifications
const sendNotification = async (userEmail, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '', // Replace with your email
        pass: ''  // Replace with your email password or app password
      }
    });

    const mailOptions = {
      from: '',  // Replace with your email
      to: '',
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail} with subject: "${subject}"`);
  } catch (error) {
    console.error(`Error sending email to ${userEmail}: ${error.message}`);
  }
};

module.exports = { sendNotification };
