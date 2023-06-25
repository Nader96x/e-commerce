const ContactUs = require("./ContactUsSchema");
const Factory = require("../../Utils/Factory");

module.exports.getContactUs = Factory.getAll(ContactUs);

module.exports.createContactUs = Factory.createOne(ContactUs);
