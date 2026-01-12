const mongoose = require('mongoose');

const settingSchema = mongoose.Schema({
    siteName: { type: String, default: 'Glasses Shop' },
    language: { type: String, default: 'en' },
    contactInfo: {
        phone: { type: String, default: '' },
        whatsapp: { type: String, default: '' },
        email: { type: String, default: '' },
        address: { type: String, default: '' },
    },
    socialMedia: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        twitter: { type: String, default: '' },
    }
}, {
    timestamps: true
});

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
