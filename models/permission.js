const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  chat: {
    C: {
      type: Boolean,
      required: true,
      default: true,
    },
    R: {
      type: Boolean,
      required: true,
      default: true,
    },
    U: {
      type: Boolean,
      required: true,
      default: true,
    },
    D: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  news: {
    C: {
      type: Boolean,
      required: true,
      default: true,
    },
    R: {
      type: Boolean,
      required: true,
      default: true,
    },
    U: {
      type: Boolean,
      required: true,
      default: true,
    },
    D: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  settings: {
    C: {
      type: Boolean,
      required: true,
      default: true,
    },
    R: {
      type: Boolean,
      required: true,
      default: true,
    },
    U: {
      type: Boolean,
      required: true,
      default: true,
    },
    D: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Permission', permissionSchema);
