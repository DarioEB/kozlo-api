const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    products: {
        type: Array,
        default: []
    },
    subtotal: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Cart', cartSchema);