const nodemailer = require("nodemailer");
const { smtpUserName, smtpUserPassword } = require("../secret");
const logger = require("../controllers/loggerController");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: smtpUserName,
    pass: smtpUserPassword,
  },
});

const emailWithNodeMailer = async (emailData) => {
  try {
    const mailOptions = {
      from: smtpUserName, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };

    const info = await transporter.sendMail(mailOptions);
    logger.log("info", "Message sent: %s", info.response);
  } catch (error) {
    logger.error(
      "error",
      "Something wrong sending email!!.Please try again: ",
      error
    );
    throw error;
  }
};

module.exports = emailWithNodeMailer;
