const Setting = require('../models/Setting');

class SettingService {
    async getSettings() {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create({});
        }
        return settings;
    }

    async updateSettings(data) {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create(data);
        } else {
            // Update fields
            if (data.siteName) settings.siteName = data.siteName;
            if (data.language) settings.language = data.language;

            if (data.contactInfo) {
                settings.contactInfo = { ...settings.contactInfo, ...data.contactInfo };
            }

            if (data.socialMedia) {
                settings.socialMedia = { ...settings.socialMedia, ...data.socialMedia };
            }

            await settings.save();
        }
        return settings;
    }
}

module.exports = new SettingService();
