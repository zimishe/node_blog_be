const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PWD,
  },
});

const sendSignupEmail = async ({ name, email }) => {
  await transporter.sendMail({
    from: '"Yevhen S. 🐈" <zimishe@gmail.com>',
    to: email,
    subject: 'Site signup ✔',
    text: 'Signup succeed',
    html: `
      Hello <b>${name}</b>, your login for our site: <b>${email}</b>`,
  });
};

const sendResetPasswordEmail = async ({ name, email }, url) => {
  await transporter.sendMail({
    from: '"Yevhen S. 🐈" <zimishe@gmail.com>',
    to: email,
    subject: 'Password reset',
    text: 'Password reset attempt',
    html: `
      Hello <b>${name}</b>, we received password reset request from this email,
      to change your password please visit ${url}.
      If that wasn't you than just ignore this letter.`,
  });
};

module.exports = {
  sendSignupEmail,
  sendResetPasswordEmail,
};
