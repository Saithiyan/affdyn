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
        type: Object,
        required: true,
        validate: {
            validator: function(v) {
                // Pour les boutons toggle, il faut scriptOn et scriptOff (string)
                if (this.isToggle) {
                    return v && typeof v.scriptOn === 'string' && typeof v.scriptOff === 'string';
                } else {
                    // Pour les autres, il faut au moins un chemin (scriptOn ou scriptOff ou path ou main)
                    return v && (typeof v.scriptOn === 'string' || typeof v.scriptOff === 'string' || typeof v.path === 'string' || typeof v.main === 'string');
                }
            },
            message: 'Le champ script doit contenir les chemins nécessaires.'
        }
    },

    isToggle: {
        type: Boolean,
        default: false
    },

    state: {
        type: String,
        enum: ['on', 'off'],
        default: 'off'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Button', buttonSchema);
