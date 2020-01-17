const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstName: {
    type: String,
    required: false,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
	middleName: {
    type: String,
    required: false,
    maxlength: 30,
  },
	surName: {
    type: String,
    required: false,
    maxlength: 30,
  },
	username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: false,
  },
	accessToken: String,
	refreshToken: String,
	accessTokenExpiredAt: Date,
  refreshTokenExpiredAt: Date,
  permission: {
    type: Schema.Types.ObjectId,
    ref: 'Permission',
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

userSchema.virtual('id').get(function(){
  return this._id.toString();
});

userSchema.virtual('image').get(function(){
  return this.avatar;
});

userSchema.set('toJSON', {
  virtuals: true
});

userSchema.set('toObject', {
  virtuals: true
});

module.exports = mongoose.model('User', userSchema);

