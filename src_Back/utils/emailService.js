const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASSWORD
    }
})


const sendEmail = async (to, subject, text) => { 
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
        }

        await transporter.sendMail(mailOptions)
        console.log("sacsses send Mail")
    }
    catch(error) {
        console.error("falid send Mail", error)
    }
}

module.exports = sendEmail

