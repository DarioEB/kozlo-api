const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    tag: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    waist: {
        type: mongoose.Schema.Types.DocumentArray,
        ref: 'Waist',
        required: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    images: {
        type: Array,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.Subdocument,
        ref: 'Category',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);