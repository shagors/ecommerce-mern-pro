const nodemailer = require("nodemailer");
const { smtpUserName, smtpUserPassword } = require("../secret");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
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
    console.log("Message sent: %s", info.response);
  } catch (error) {
    console.error("Something wrong sending email!!.Please try again: ", error);
    throw error;
  }
};

module.exports = emailWithNodeMailer;
