import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
      user: 'shadabkp2003@gmail.com.', // Your email
      pass:  // Your email password or app password
    },
  });

  const mailOptions = {
    from: 'shadabkp2003@gmail.com',
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
}; 