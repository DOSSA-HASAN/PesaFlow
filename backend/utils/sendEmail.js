import nodemailer from "nodemailer"
import "dotenv/config.js"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
})

export const sendEmail = async (to, subject, body) => {
    try {
        const mailOptions = {
            to,
            subject,
            text: body
        }
        await transporter.sendMail(mailOptions)
    } catch (e) {
        console.error(`❌ Failed to send email:\n ${e.message}`)
    }
}