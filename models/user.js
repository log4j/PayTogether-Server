var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');


var UserSchema = new Schema({
  username: { type: String},
  nickname: { type: String},
  sex: { type:Boolean, default: true},
  pass: { type: String },
  email: { type: String},
  avatar: { type: String },
  location: { type: String },
  signature: { type: String },
  profile: { type: String },
  is_block: {type: Boolean, default: false},

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }


});

UserSchema.virtual('avatar_url').get(function () {
  
  return 'avatars/'+this.avatar;
});


UserSchema.index({username: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});

mongoose.model('User', UserSchema);
