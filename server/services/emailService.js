const nodemailer = require('nodemailer');

const Host = process.env.EMAIL_HOST || '';
const Port = process.env.EMAIL_PORT || '';
const Username = process.env.EMAIL_USERNAME || '';
const Password = process.env.EMAIL_PASSWORD || '';
const ServerAddress = process.env.SERVER_ADDRESS || '';
const From = 'Slave info';

const Transporter = nodemailer.createTransport({
  host: Host,
  port: Port,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: Username,
    pass: Password
  }
});

class EmailService {

  static sendPasswordRenewEmail(receiver, playerName, token) {
    const address = `${ServerAddress}/renew/${token}`;
    let mailOptions = {
      from: From,
      to: receiver,
      subject: 'Slave account password reset',
      text: `Hi, ${playerName}!\n\n` +
        `Please, click the following link to reset the password of your Slave account: ${address}\n\n` +
        'The link is valid for 24 hours. If you didn\'t order this message, you can ignore it.\n\n' +
        'Thanks!',
      html: `<h2>Hi, ${playerName}!</h2>` +
        '<p>Please, click the following link to reset the password of your Slave account: ' +
        `<a href="${address}">reset password</a></p>` +
        '<p>The link is valid for 24 hours. If you didn\'t order this message, you can ignore it.</p>' +
        '<p>Thanks!</p>'
    };

    if (process.env.NODE_ENV === 'dev') {
      console.log('Sending email:', mailOptions); // eslint-disable-line no-console
    }

    Transporter.sendMail(mailOptions, (error) => { // eslint-disable-line consistent-return
      if (error) {
        return console.log(error); // eslint-disable-line no-console
      }
    });
  }

}

module.exports = EmailService;
