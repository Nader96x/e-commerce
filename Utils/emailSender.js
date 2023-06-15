const fs = require("fs");
const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = `e-commerce <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // console.log(`${__dirname}/../../views/${template}.html`);
    const html = fs
      .readFileSync(`${__dirname}/../Views/${template}.html`, "utf-8")
      .replaceAll("{{name}}", this.name)
      .replaceAll("{{url}}", this.url);

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send(
      "verify-email",
      "Welcome to the E-commerce Family!, please Verify your email"
    );
  }

  async sendPasswordReset() {
    await this.send(
      "reset-password",
      "Your password reset token (valid for only 30 minutes)"
    );
  }
};
