const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: false,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    validation: {
        type: String,
        required: true,
        trim: true
    },
    validated: {
        type: Boolean,
        default: false
    },
    shop_cart: {
        type: Array,
        default: null
    },
    type: {
        type: String,
        default: 'staff'
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', userSchema);
