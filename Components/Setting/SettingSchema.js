const mongoose = require("mongoose");

const BannerSchema = mongoose.Schema({
  image: {
    type: String,
    required: [true, "Banner must have an image."],
  },
  url: {
    type: String,
    required: [true, "Banner must have a url."],
  },
  alt: {
    type: String,
    required: [true, "Banner must have an alt."],
  },
});

const AddressSchema = mongoose.Schema({
  street: {
    type: String,
    required: [true, "Address must have a street."],
  },
  city: {
    type: String,
    required: [true, "Address must have a city."],
  },
  state: {
    type: String,
    required: [true, "Address must have a state."],
  },
  country: {
    type: String,
    required: [true, "Address must have a country."],
  },
});

const SettingSchema = mongoose.Schema({
  logo: String,
  email: String,
  locations: [Object],
  phone: {
    type: String,
    minLength: [10, "Setting's phone number can't be less than 10 characters"],
    maxLength: [10, "Setting's phone number can't be more than 10 characters"],
  },
  terms_and_conditions: String,
  about_us: String,
  social_media: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
  },
  address: AddressSchema,
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
    return await this.findOne({ name: "setting" });
  },
};

module.exports = mongoose.model("Setting", SettingsSchema);
