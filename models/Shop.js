const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
    id_payment_transaction: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    },
    status_transaction: {
        type: String,
        required: true,
        trim: true
    },
    status_transaction_detail: {
        type: String,
        required: true,
        trim: true
    },
    order_products: {
        type: Array
    },
    subtotal: {
        type: Number,
        required: true,
        trim: true
    },
    shipping_cost: {
        type: Number,
        required: true,
        trim: true
    },
    total_cost: {
        type: Number,
        required: true,
        trim: true
    },
    amount_transaction: {
        type: Number,
        required :true,
        trim: true
    },
    client_name: {
        type: String,
        required: true,
        trim: true
    },
    client_lastname: {
        type: String,
        required: true,
        trim: true
    },
    client_phone: {
        type: String,
        required: true,
        trim: true
    },
    client_email: {
        type: String,
        required: true,
        trim: true
    },
    client_country: {
        type: String,
        required: true,
        trim: true
    },
    client_zip: {
        type: String,
        required: true,
        trim: true
    },
    client_street: {
        type: String,
        required: true,
        trim: true
    },
    client_street_number: {
        type: String,
        required: true,
        trim: true
    },
    client_departament: {
        type: String,
        required: false,
        trim: true
    },
    client_suburb: {
        type: String,
        required: false,
        trim: true
    },
    client_city: {
        type: String,
        required: true,
        trim: true
    },
    client_province: {
        type: String,
        required: true,
        trim: true
    },
    client_billing_information: {
        type: String,
        required: true,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Shop', shopSchema);