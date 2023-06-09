const mongoose = require("mongoose");

const BannerSchema = mongoose.Schema({
  _id: false,
  image: {
    type: String,
    required: [true, "Banner must have an image."],
  },
  link: {
    type: String,
    required: [true, "Banner must have a link."],
  },
  alt: {
    type: String,
    // required: [true, "Banner must have an alt."],
  },
});

const AddressSchema = mongoose.Schema({
  _id: false,
  street: {
    type: String,
    // required: [true, "Address must have a street."],
  },
  city: {
    type: String,
    // required: [true, "Address must have a city."],
  },
  state: {
    type: String,
    // required: [true, "Address must have a state."],
  },
  country: {
    type: String,
    // required: [true, "Address must have a country."],
  },
});

const SocialMedia = mongoose.Schema({
  _id: false,
  url: {
    type: String,
    required: [true, "Social Media must have a url."],
  },
  name: {
    type: String,
    required: [true, "Social Media must have a name."],
  },
});
const SettingSchema = mongoose.Schema({
  _id: false,
  logo: String,
  email: String,
  locations: [String],
  phone: {
    type: String,
    validate: {
      validator: function (value) {
        const egyptianRegex = /^01[0125][0-9]{8}$/;
        return egyptianRegex.test(value);
      },
      message: "Please enter Valid phone number",
    },
  },
  terms_and_conditions: String,
  about_us: String,
  contact_us: String,
  social_media: [SocialMedia],
  banners: [BannerSchema],
});

const SettingsSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Employee must have a name."],
    // unique: [true, "Employee's name must be unique."],
    default: "setting",
  },
  setting: SettingSchema,
});

// Static Methods
SettingsSchema.statics = {
  toJSON() {
    return this.setting;
  },
  /*find() {
    return this.findOne({ name: "setting" });
  },*/
  update(args) {
    delete args._id;
    return this.findOneAndUpdate({ name: "setting" }, args, {
      new: true,
      runValidators: true,
    });
  },
  findOneAndUpdate(args) {
    // remove id from args
    delete args._id;
    return this.findOneAndUpdate({ name: "setting" }, args, {
      new: true,
      runValidators: true,
    });
  },
  async setting() {
    let setting = await this.findOne({ name: "setting" });
    if (!setting) {
      setting = await this.create({
        name: "setting",
        setting: {
          logo: "",
          email: "",
          locations: [],
          phone: "01000000000",
          terms_and_conditions: "",
          about_us: "",
          contact_us: "",
          social_media: [],
          banners: [],
        },
      });
    }
    return setting;
  },
};

module.exports = mongoose.model("Setting", SettingsSchema);
