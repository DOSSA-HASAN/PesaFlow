import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        username: process.env.MAIL_USERNAME,
        password: process.env.MAIL_PASSWORD
    }
})

export const sendEmail = async (to, subject, body) => {
    try {
        const mailOptions = {
            to,
            subject,
            body
        }
        await transporter.sendMail(mailOptions)
    } catch (e){
        console.error(`❌ Failed to send email:\n ${e.message}`)
    }
}