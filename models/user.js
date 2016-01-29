var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');


var UserSchema = new Schema({
    username: {
        type: String,
        // index: { unique: false}
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
        // index: { unique: false }
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
    groups: [Schema.Types.ObjectId],
    invisible: {
        type: Boolean,
        default: false
    },
    invitor:{
        type: Schema.Types.ObjectId  
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

    
},{
    toObject: {
    virtuals: true
    }
    ,toJSON: {
    virtuals: true
    }
});

UserSchema.virtual('displayName').get(function () {
    if(this.invisible){
        if(this.firstname)
            return this.firstname;
        else
            return this.username;
    }else{
        if(this.firstname || this.lastname){
            return this.firstname+' '+this.lastname;
        }else{
            return this.username;
        }
    }
});

UserSchema.virtual('tag').get(function () {
    if(this.invisible){
        return '';
    }else{
        return this.email;
    }
});



UserSchema.virtual('age').get(function () {
    return 18;
    //return 'http://www.gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48';
    //return 'avatars/' + this.avatar;
});

// UserSchema.index({
//     username: 1,
//     email: 1
// }, {
//     unique: false
// });

mongoose.model('User', UserSchema);
