const nodemailer = require('nodemailer');

const Address = process.env.EMAIL_ADDRESS || '';
const Host = process.env.EMAIL_HOST || '';
const Port = process.env.EMAIL_PORT || '';
const Username = process.env.EMAIL_USERNAME || '';
const Password = process.env.EMAIL_PASSWORD || '';
const From = process.env.EMAIL_FROM || '';
const ServerAddress = process.env.SERVER_ADDRESS || '';

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

  static sendAccountActivationEmail(receiver, playerName, token) {
    const address = `${ServerAddress}/activate/${token}`;
    const subject = 'Slave account activation';
    const text = `Welcome to play slave, ${playerName}!\n\n` +
      `Please, click the following link to activate your Slave account: ${address}\n\n` +
      'The link is valid for 24 hours. If you didn\'t create an account for Slave, you can ignore this message.\n\n' +
      'Thanks!';
    const html = `<h2>Welcome to play Slave, ${playerName}!</h2>` +
      '<p>Please, click the following link to activate your Slave account: ' +
      `<a href="${address}">activate account</a></p>` +
      '<p>The link is valid for 24 hours. ' +
      'If you didn\'t create an account for Slave, you can ignore this message.</p>' +
      '<p>Thanks!</p>';

    EmailService.sendEmail(receiver, subject, text, html);
  }

  static sendPasswordRenewEmail(receiver, playerName, token) {
    const address = `${ServerAddress}/renew/${token}`;
    const subject = 'Slave account password reset';
    const text = `Hi, ${playerName}!\n\n` +
      `Please, click the following link to reset the password of your Slave account: ${address}\n\n` +
      'The link is valid for 24 hours. If you didn\'t order this message, you can ignore it.\n\n' +
      'Thanks!';
    const html = `<h2>Hi, ${playerName}!</h2>` +
      '<p>Please, click the following link to reset the password of your Slave account: ' +
      `<a href="${address}">reset password</a></p>` +
      '<p>The link is valid for 24 hours. If you didn\'t order this message, you can ignore it.</p>' +
      '<p>Thanks!</p>';

    EmailService.sendEmail(receiver, subject, text, html);
  }

  static sendEmailAddressReservedEmail(receiver) {
    const forgotAddress = `${ServerAddress}/forgot`;
    const profileAddress = `${ServerAddress}/profile`;
    const subject = 'Slave account activation';
    const text = 'Hi,\n\nYou already have a Slave account registered with this email address.\n\n' +
      `If you have forgot your password, please, navigate to ${forgotAddress}\n\n` +
      'If you are logged in and want to change your player name or password, you can do it in your account\'s ' +
      `profile page ${profileAddress}\n\n` +
      'Thanks!';
    const html = '<h2>Hi</h2><p>You already have a Slave account registered with this email address.</p>' +
      `<p>If you have forgot your password, please, navigate to <a href="${forgotAddress}">forgot page</a>.</p>` +
      '<p>If you are logged in and want to change your player name or password, you can do it in your account\'s ' +
      `<a href="${profileAddress}">profile page</a>.</p>` +
      '<p>Thanks!</p>';

    EmailService.sendEmail(receiver, subject, text, html);
  }

  static sendEmail(receiver, subject, text, html) {
    const mailOptions = {
      from: `"${From}" <${Address}>`,
      to: receiver,
      subject: subject,
      text: text,
      html: html
    };

    if (process.env.NODE_ENV === 'dev') {
      console.log('Sending email:', mailOptions); // eslint-disable-line no-console
    }

    Transporter.sendMail(mailOptions, (error) => { // eslint-disable-line consistent-return
      if (error && process.env.NODE_ENV !== 'test') {
        return console.log(error); // eslint-disable-line no-console
      }
    });
  }

}

module.exports = EmailService;
