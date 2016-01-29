var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var ActivitySchema = new Schema({
    group: {
        type: ObjectId
    },
    from: {
        type: ObjectId
    },
    to: {
        type: [Schema.Types.Mixed]
    },
    is_pay: {
        type: Boolean,
        default: true
    },
    share_by_percentage: {
        type: Boolean,
        default: true
    },
    amount: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        defualt: ''
    },
    date: {
        type: String,
        default: ''  
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }
});

ActivitySchema.index({
    group: 1
}, {
    unique: false
});


mongoose.model('Activity', ActivitySchema);