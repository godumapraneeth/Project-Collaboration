import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host:"smtp.gmail.com",
  port:465, 
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"Project Collabaration" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Email sending failed:", err);
    throw err;
  }
};

export default transporter;

