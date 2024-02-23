// models/accessRequest.js
const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  granted: { type: Boolean, default: false }
});

const AccessRequest = mongoose.model('AccessRequest', accessRequestSchema);

module.exports = AccessRequest;
