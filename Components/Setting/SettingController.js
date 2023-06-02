const Setting = require("./SettingSchema");

module.exports.getSettings = async (req, res) => {
  try {
    // console.log("getSettings");
    const settings = await Setting.setting();
    // console.log("settings", settings);

    res.status(200).json({ status: "success", data: settings.setting });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports.updateSetting = async (req, res) => {
  try {
    const settings = await Setting.setting();
    console.log("settings", settings.setting);
    console.log({ ...settings.setting._doc, ...req.body });
    settings.setting = { ...settings.setting._doc, ...req.body };
    await settings.save();
    console.log("setting after", settings.setting);
    res.status(200).json({ status: "success", data: settings.setting });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};
