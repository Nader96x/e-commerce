const fs = require("fs");
const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url, order = null) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = `e-commerce <${process.env.EMAIL_FROM}>`;
    this.order = order;
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
    let html = fs
      .readFileSync(`${__dirname}/../Views/${template}.html`, "utf-8")
      .replaceAll("{{name}}", this.name)
      .replaceAll("{{url}}", this.url);
    if (this.order) {
      html = html
        .replaceAll("{{order_id}}", this.order._id)
        .replaceAll("{{order_status}}", this.order.status)
        .replaceAll("{{order_total_price}}", this.order.total_price)
        .replaceAll(
          "{{order_createdAt}}",
          new Date(this.order.createdAt).toLocaleDateString()
        )
        .replaceAll(
          "{{order_updatedAt}}",
          new Date(this.order.updatedAt).toLocaleDateString()
        )
        .replaceAll("{{order_payment_method}}", this.order.payment_method)
        .replaceAll("{{order_payment_status}}", this.order.payment_status);
    }
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

  async sendStatusChange() {
    await this.send(
      "order-status-changed",
      "Your order status has been changed"
    );
  }
};
