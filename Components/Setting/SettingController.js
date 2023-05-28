const Setting = require("./SettingSchema");

module.exports.getSettings = async (req, res) => {
  try {
    // console.log("getSettings");
    let settings = await Setting.setting();
    // console.log("settings", settings);
    if (!settings) {
      settings = await Setting.create({
        name: "setting",
        setting: {
          logo: "",
          email: "",
          locations: [],
          // phone: "",
          terms_and_conditions: "",
          about_us: "",
          social_media: {
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: "",
          },
          /*address: {
            street: "",
            city: "",
            state: "",
            country: "",
          },*/
          banners: [],
        },
      });
    }
    res.status(200).json({ status: "success", data: settings.setting });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports.updateSetting = async (req, res) => {
  try {
    const settings = await Setting.setting();
    // console.log("settings", settings.setting);
    console.log({ ...settings.setting._doc, ...req.body });
    settings.setting = { ...settings.setting._doc, ...req.body };
    await settings.save();
    console.log("setting after", settings.setting);
    res.status(200).json({ status: "success", data: settings.setting });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};
