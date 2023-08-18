import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export  async function sendEmail(to,subject,html,attachment) {

  let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from:`Wesam co. " <${process.env.EMAIL}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
    attachments:attachment,
  });
}
