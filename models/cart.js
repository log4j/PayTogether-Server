var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var CartSchema = new Schema({
    user: {
        type: ObjectId,
        ref : 'User'
    },
    commodity: {
        type: ObjectId,
        ref : 'Commodity'
    },
    amount:{
        type: Number,
        default: 1
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


mongoose.model('Cart', CartSchema);
