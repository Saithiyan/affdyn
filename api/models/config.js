const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    id: { 
        type: Number, 
        required: true,
        unique: true
    },
    name: { 
        type: String, 
        required: true,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Config', configSchema);