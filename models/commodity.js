var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var CommoditySchema = new Schema({
    name: {
        type: String
    },
    producer :{
        type: String
    },
    images: [String],
    sold: {
        type: Number,
        default:0
    },
    stock: {
        type: Number,
        default:100
    },
    models: [Schema.Types.Mixed],
    description: [Schema.Types.Mixed],
    tags: Schema.Types.Mixed,
    create_at: {
        type: Date,
        default: Date.now
    },
    price: {type:Number,default:0},
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

mongoose.model('Commodity', CommoditySchema);
