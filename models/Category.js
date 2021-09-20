const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    waist_type: {
        type: Number,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Category', categorySchema);