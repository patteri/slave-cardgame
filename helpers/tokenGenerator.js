// Creates a token containing characters between 0-9 and a-z
var generator = {
  generateToken: () => {
    return Math.random().toString(36).substr(2); // Remove `0.`
  }
};

module.exports = generator;