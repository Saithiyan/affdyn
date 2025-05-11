const mongoose = require('mongoose');

const buttonSchema = mongoose.Schema({
    id: { 
        type: Number,
        required: true,
        unique: true
    },
    
    configid: {
        type: Number,
        required: true,
        index: true
    },
    
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    style: {
        fontcolor: {
            type: String,
            default: '#000000'
        },
        bgcolor: {
            type: String,
            default: '#FFFFFF'
        },
        height: {
            type: Number,
            default: 50
        },
        width: {
            type: Number,
            default: 50
        }
    },
    
    script: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Button', buttonSchema);
