const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

newsSchema.virtual('id').get(function(){
  return this._id.toString();
});

newsSchema.set('toJSON', {
  virtuals: true
});

newsSchema.set('toObject', {
  virtuals: true
});


module.exports = mongoose.model('News', newsSchema);
