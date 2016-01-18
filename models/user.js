var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');


var UserSchema = new Schema({
    username: {
        type: String,
        index: { unique: true}
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    gender: {
        type: String,
        default: 'male'
    },
    password: {
        type: String
    },
    email: {
        type: String,
        index: { unique: true }
    },
    birthday: {
        type: Date
    },
    avatar: {
        type: String,
        default: 'default.png'
    },
    phone: {
        type: String
    },
    drinking: {
        type: Number,
        default: 0
    },
    smoking: {
        type: Number,
        default: 0
    },
    is_block: {
        type: Boolean,
        default: false
    },
    apartment: Schema.Types.ObjectId,
    room: String,
    driving: {

    },
    cooking: {
        type: Number,
        default: 0
    },
    pet: {
        type: Boolean,
        default: false
    },
    desc: {
        type: String
    },
    seeking: {
        type: Boolean,
        default: false
    },
    basic_visible: {
        type: Boolean,
        default: true
    },
    habit_visible: {
        type: Boolean,
        default: true
    },
    rent_start :{
        type: Date
    },
    rent_end : {
        type : Date
    },
    rent_duration : {
        type: Number,
        default: 0
    },
    max_roommates: {
        type: Number
    },
    profile_filled : {
        type: Boolean
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    },
    last_login: {
        type: Date,
        default: Date.now
    }


});

UserSchema.virtual('avatar_url').get(function () {
    //if(this.avatar){
        return '/avatar/'+this.avatar;
    //}
    //return 'http://www.gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48';
    //return 'avatars/' + this.avatar;
});


UserSchema.virtual('age').get(function () {
    return 18;
    //return 'http://www.gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48';
    //return 'avatars/' + this.avatar;
});


UserSchema.index({
    username: 1,
    email: 1
}, {
    unique: true
});
UserSchema.index({

}, {
    unique: true
});

mongoose.model('User', UserSchema);
