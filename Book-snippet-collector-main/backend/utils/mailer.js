const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // For debugging: Log the credentials being used
  console.log('--- Email Config ---');
  console.log('HOST:', process.env.EMAIL_HOST);
  console.log('PORT:', process.env.EMAIL_PORT);
  console.log('USER:', process.env.EMAIL_USER);
  console.log('--------------------');

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Book Snippets" <noreply@booksnippets.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    console.log('Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully! Message ID:', info.messageId);
  } catch (error) {
    // This will now log the detailed error from Nodemailer
    console.error('!!! NODEMAILER ERROR !!!', error);
    // Re-throw the error so the controller's catch block can handle it
    throw new Error('Failed to send email via Nodemailer.');
  }
};

module.exports = sendEmail;