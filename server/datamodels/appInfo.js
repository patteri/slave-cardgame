const mongoose = require('mongoose');

const appInfoSchema = mongoose.Schema({
  databaseInitialized: { type: Boolean, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('AppInfo', appInfoSchema);
