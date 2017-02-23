// Creates a token containing characters between 0-9 and a-z
const generator = {
  generateToken: () => Math.random().toString(36).substr(2) // Remove '0.'
};

module.exports = generator;
