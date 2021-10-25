const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    tags: {
        type: Array
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    waists: {
        type: Array,
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    young: {
        type: Boolean,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Product', productSchema);