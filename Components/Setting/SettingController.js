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
    // console.log("settings", settings.setting);
    // console.log({ ...settings.setting._doc, ...req.body });
    settings.setting = { ...settings.setting._doc, ...req.body };
    await settings.save();
    // console.log("setting after", settings.setting);
    res.status(200).json({ status: "success", data: settings.setting });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports.banners = async (req, res) => {
  try {
    const settings = await Setting.setting();
    // console.log("settings", settings.setting);
    res.status(200).json({ status: "success", data: settings.setting.banners });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports.terms = async (req, res) => {
  try {
    const settings = await Setting.setting();
    // console.log("settings", settings.setting);
    res
      .status(200)
      .json({ status: "success", data: settings.setting.terms_and_conditions });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports.about_us = async (req, res) => {
  try {
    const settings = await Setting.setting();
    // console.log("settings", settings.setting);
    res
      .status(200)
      .json({ status: "success", data: settings.setting.about_us });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports.contact_us = async (req, res) => {
  try {
    const settings = await Setting.setting();
    // console.log("settings", settings.setting);
    res
      .status(200)
      .json({ status: "success", data: settings.setting.contact_us });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports.info = async (req, res) => {
  try {
    const settings = await Setting.setting();
    // console.log("settings", settings.setting);
    const data = {
      logo: settings.setting.logo,
      email: settings.setting.email,
      locations: settings.setting.locations,
      phone: settings.setting.phone,
      social_media: settings.setting.social_media,
    };
    res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};
