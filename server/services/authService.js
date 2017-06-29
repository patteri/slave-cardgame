const jwt = require('jwt-simple');
const crypto = require('crypto');
const User = require('../datamodels/user');
const UserStatistics = require('../datamodels/userStatistics');
const { GameValidation } = require('../../client/src/shared/constants');
const EmailService = require('./emailService');

const JwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret';
const AuthTokenValidityTime = 7; // Auth token validity time in days
const ForgotTokenValidityTime = 1; // Forgot password token validity time in days

class AuthService {

  static getPwdHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  static getUserToken(username, validityTime) {
    const date = new Date();
    const expires = date.setDate(date.getDate() + validityTime);
    return {
      token: jwt.encode({
        username: username,
        expireDate: expires
      }, JwtSecret),
      expires: expires
    };
  }

  // Finds a user by the specified token and returns the user
  static findUserByToken(token) {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.decode(token, JwtSecret);
        if (decoded.expireDate > Date.now()) {
          User.findOne({ username: decoded.username, active: true }).exec().then((user) => {
            resolve(user);
          });
        }
        else {
          reject();
        }
      }
      catch (err) {
        reject();
      }
    });
  }

  // Finds a user by the specified user name and password
  static findUserByCredentials(username, password) {
    return User.findOne({ username: username, password: AuthService.getPwdHash(password), active: true }).exec();
  }

  // Finds a user by the specified user name
  // Can be used for example for checking if a user exists
  static findUserByUsername(username) {
    return User.findOne({ username: username }).exec();
  }

  // Generates the auth token for the specified user
  static generateAuthToken(user) {
    return AuthService.getUserToken(user.username, AuthTokenValidityTime);
  }

  // Generates a random token containing hex characters
  // length: length of the token. Must be even number, otherwise the result length is length - 1.
  static generateRandomToken(length) {
    return crypto.randomBytes(Math.floor(length / 2)).toString('hex');
  }

  // Parses auth token from the request
  static parseTokenFromReq(req) {
    return (req.body && req.body.access_token) || (req.query && req.query.access_token) ||
      req.headers['x-access-token'];
  }

  // Registers the user
  // Note: doesn't validate the input parameters so it must be validated before calling the method
  static register(username, password, email) {
    const user = new User({
      username: username,
      password: AuthService.getPwdHash(password),
      email: email,
      active: true
    });
    const userStatistics = new UserStatistics({
      username: username
    });

    return userStatistics.save().then(() => user.save());
  }

  // Generates the forgot password token for the specified username
  static generateForgotPasswordToken(username) {
    return AuthService.getUserToken(username, ForgotTokenValidityTime);
  }

  // Orders password renewal email for accounts registered with the specified email address
  static orderPasswordRenewal(email) {
    return new Promise((resolve, reject) => {
      User.find({ email: email }).then((users) => {
        if (users && users.length > 0) {
          users.forEach((user) => {
            const token = AuthService.generateForgotPasswordToken(user.username).token;
            EmailService.sendPasswordRenewEmail(user.email, user.username, token);
          });
          return resolve();
        }
        return reject();
      });
    });
  }

  // Changes the password of a user specified by the token
  // Note: doesn't validate the password so it must be validated before calling the method
  static changePassword(token, password) {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.decode(token, JwtSecret);
        if (decoded.expireDate > Date.now()) {
          return User.findOne({ username: decoded.username }).then((user) => {
            if (user) {
              user.password = AuthService.getPwdHash(password);
              return user.save().then(() => resolve());
            }
            return reject();
          });
        }
      }
      catch (err) { // eslint-ignore-line no-empty
      }
      return reject();
    });
  }

  static validateUsername(username) {
    return !(!(typeof (username) === 'string') || username.length < GameValidation.minUsernameLength ||
      username.length > GameValidation.maxUsernameLength);
  }

  static validatePassword(password) {
    return !(!(typeof (password) === 'string') || password.length < GameValidation.minPasswordLength ||
      password.length > GameValidation.maxPasswordLength);
  }

}

module.exports = AuthService;
