const jwt = require('jwt-simple');
const crypto = require('crypto');
const User = require('../datamodels/user');
const UserStatistics = require('../datamodels/userStatistics');
const { GameValidation } = require('../../client/src/shared/constants');

const JwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret';
const TokenValidityTime = 7; // Validity time in days

class AuthService {

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
    const encrypted = crypto.createHash('sha256').update(password).digest('hex');
    return User.findOne({ username: username, password: encrypted, active: true }).exec();
  }

  // Finds a user by the specified user name
  // Can be used for example for checking if a user exists
  static findUserByUsername(username) {
    return User.findOne({ username: username }).exec();
  }

  // Generates the auth token for the specified user
  static generateAuthToken(user) {
    const date = new Date();
    const expires = date.setDate(date.getDate() + TokenValidityTime);
    return {
      token: jwt.encode({
        username: user.username,
        expireDate: expires
      }, JwtSecret),
      expires: expires
    };
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
  // Note: doesn't validate the username so it must be validated before calling the method
  static register(username, password, email) {
    const user = new User({
      username: username,
      password: crypto.createHash('sha256').update(password).digest('hex'),
      email: email,
      active: true
    });
    const userStatistics = new UserStatistics({
      username: username
    });

    return userStatistics.save().then(() => user.save());
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
