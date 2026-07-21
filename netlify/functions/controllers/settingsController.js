const Settings = require('../models/Settings');

// GET /api/settings/:key - Retrieve a setting by key
exports.getSetting = async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    if (!setting) return res.status(404).json({ message: 'Setting not found' });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/settings - Retrieve all settings as key-value map
exports.getAllSettings = async (req, res) => {
  try {
    const all = await Settings.find();
    const map = {};
    all.forEach(s => { map[s.key] = s.value; });
    res.json(map);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/settings/:key - Create or update a setting
exports.updateSetting = async (req, res) => {
  try {
    const { value } = req.body;
    if (value === undefined || value === null) {
      return res.status(400).json({ message: 'Value is required' });
    }
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { key: req.params.key, value },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/settings/:key - Delete a setting
exports.deleteSetting = async (req, res) => {
  try {
    await Settings.findOneAndDelete({ key: req.params.key });
    res.json({ message: 'Setting deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
