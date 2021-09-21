import nodemailer from 'nodemailer'

const send = async (mailInfo) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  const info = await transporter.sendMail(mailInfo)
  console.log('preview & url: %s', nodemailer.getTestMessageUrl(info))
}

export const emailProcessor = ({ email, otp }) => {
  const link = `${process.env.ROOT_URL}?otp=${otp}&email=${email}`
  const mailObj = {
    from: `"Eshop " <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'User email verification',
    text: `Hi there, please floow the link to verify your email. ${link}`,
    html: `
          Hello there,
          <br />
          <p>Thank you for registering, please follow the instructions for verification
          </p>
          <br />
          <p> <a href="${link}"> link</a></p>


          `,
  }
  send(mailObj)
}
export const emailVerifivationWelcome = (email) => {
  const mailObj = {
    from: `"Eshop " <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'User email verified',
    text: `Hi there, your email has been verified.`,
    html: `
          Hello there,
          <br />
          <p>Thank you for registering, your email has been verified
          </p>


          `,
  }
  send(mailObj)
}
