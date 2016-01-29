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
    activities : [Schema.Types.ObjectId],
    pay_amount: {
        type: Number,
        default: 0
    },
    icon :{
        type: String,
        default: 'users'
    },
    color: {
        type: String,
        default: 'blue'
    },
    users: [Schema.Types.ObjectId],
    fresh_users :[Schema.Types.Mixed],
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }
});

// GroupSchema.virtual('pay_percent').get(function () {
//     if(this.expected_amount==0)
//         return 0;
//     return parseInt((this.pay_amount*100/(this.member_amount * this.expected_amount)).toFixed(2));
// });


// GroupSchema.virtual('expected_total').get(function () {
//     return (this.member_amount * this.expected_amount);
// });


/*
GroupSchema.index({
    name: 1
}, {
    unique: false
});
*/

mongoose.model('Group', GroupSchema);