var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var GroupSchema = new Schema({
    name: {
        type: String
    },
    creator: {
        type: ObjectId
    },
    member_amount: {
        type: Number,
        default: 0
    },
    pay_amount: {
        type: Number,
        default: 0
    },
    card_icon :{
        type: String,
        default: 'fa-users'
    },
    card_color: {
        type: String,
        default: 'blue'
    },
    expected_amount: {
        type: Number,
        default: 1
    },
    users: [Schema.Types.ObjectId],
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }
});

GroupSchema.virtual('pay_percent').get(function () {
    if(this.expected_amount==0)
        return 0;
    return (this.pay_amount*100/(this.member_amount * this.expected_amount)).toFixed(2);
});


GroupSchema.virtual('expected_total').get(function () {
    return (this.member_amount * this.expected_amount);
});


/*
GroupSchema.index({
    name: 1
}, {
    unique: false
});
*/

mongoose.model('Group', GroupSchema);