const nodemailer = require('nodemailer');

const sendEmail = async ({ name, email }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PWD,
    },
  });

  await transporter.sendMail({
    from: '"Yevhen S. 👻" <zimishe@gmail.com>',
    to: 'zimishe@gmail.com',
    subject: 'Site signup ✔',
    text: 'Signup succeed',
    html: `
      Hello <b>${name}</b>, your login for our site: <b>${email}</b>`,
  });
};

module.exports = {
  sendEmail,
};
