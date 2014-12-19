var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');


var UserSchema = new Schema({
    name: {
        type: String
    },
    loginname: {
        type: String
    },
    sex: {
        type: Boolean,
        default: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    avatar: {
        type: String,
        default: 'default.png'
    },
    location: {
        type: String
    },
    signature: {
        type: String
    },
    profile: {
        type: String
    },
    is_block: {
        type: Boolean,
        default: false
    },
    groups: [Schema.Types.ObjectId],


    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }


});

UserSchema.virtual('avatar_url').get(function () {

    return 'avatars/' + this.avatar;
});


UserSchema.index({
    loginname: 1
}, {
    unique: true
});
UserSchema.index({
    email: 1
}, {
    unique: false
});

mongoose.model('User', UserSchema);