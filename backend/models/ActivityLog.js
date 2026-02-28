const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE'],
    required: true,
  },
  entityName: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

activityLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
