var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var OrderSchema = new Schema({
    order_no: {
        type: String
    },
    status :{
        type: String,
        lowercase:true,
        enum:['preparing','confirmed','shipped']
    },
    user :{
        type: ObjectId
    },
    price_before_tax : {
        type: Number
    },
    price_tax : {
        type: Number
    },
    ship_fee : {
        type: Number
    },
    items: [Schema.Types.Mixed],
    ship_address: Schema.Types.Mixed,
    billing_address: Schema.Types.Mixed,
    receive_name :{
        type: String
    },
    phone :{
        type: String
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




/*
GroupSchema.index({
    name: 1
}, {
    unique: false
});
*/

mongoose.model('Order', OrderSchema);
