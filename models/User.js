const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
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
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    type: {
        type: String,
        default: 'staff'
    },
    shops: {
        type: Array
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', userSchema);
