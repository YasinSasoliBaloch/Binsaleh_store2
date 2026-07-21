// controllers/settingsController.js
// CRUD for Settings model — used for CMS, announcements, slider, setup key, categories, coupons, etc.

const Settings = require('../models/Settings');

exports.getSetting = async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    if (!setting) return res.status(404).json({ message: 'Setting not found' });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Settings.find().sort({ key: 1 });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { value } = req.body;
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { upsert: true, new: true, runValidators: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSetting = async (req, res) => {
  try {
    const setting = await Settings.findOneAndDelete({ key: req.params.key });
    if (!setting) return res.status(404).json({ message: 'Setting not found' });
    res.json({ message: 'Setting deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
