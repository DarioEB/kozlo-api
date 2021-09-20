const mongoose = require('mongoose');
const Schema = new mongoose.Schema;

const waistSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: Number,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Waist', waistSchema);