require("dotenv").config();
const nodemailer = require("nodemailer");
const config = require('../config/config');
const { mailTemplate } = require('../helper/mailTemplate');

const transport = nodemailer.createTransport(config.emailConfig.smtp);
if (["development", "test"].includes(process.env.NODE_ENV) === false) {
    transport
      .verify()
      .then(() => console.log("Connected to email server"))
      .catch(() =>
        console.error(
          "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
        )
    );
}

const sendEmail = async ({ to, subject, text }) => {
    var from = config.emailConfig.from;
    if (["development", "test"].includes(process.env.NODE_ENV) === false) {
      await transport.sendMail({ from, to, subject, text, html: text });
    }
};

exports.sendLink = async ({ to, subject, description }) => {
    const html = mailTemplate(subject, description);
    await sendEmail({ to, subject, text: html });
}