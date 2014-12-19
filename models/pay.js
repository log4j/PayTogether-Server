var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var PaySchema = new Schema({
    group: {
        type: ObjectId
    },
    from: {
        type: ObjectId
    },
    to: {
        type: [Schema.Types.ObjectId]
    },
    isPay: {
        type: Boolean,
        default: true
    },
    amount: {
        type: Number,
        default: 0
    },
    memo: {
        type: String,
        defualt: ''
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

PaySchema.index({
    group: 1
}, {
    unique: false
});


mongoose.model('Pay', PaySchema);