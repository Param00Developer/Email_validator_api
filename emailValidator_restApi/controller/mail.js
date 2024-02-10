
import nodemailer from "nodemailer"
import jwt from 'jsonwebtoken';
import "dotenv/config"

//3. cofigure mail and send it
async function sendMail(userEmail,uId){
    console.log(userEmail)
   const transporter =  nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: 'trueboy978@gmail.com',
            pass: process.env.PASS
        }
    })
    const payload = { userId:uId};
    const secretKey =process.env.SECERATE_KEY;
    const emailtoken = jwt.sign(payload, secretKey, { expiresIn: '30m' });

    const url = `http://localhost:5000/confirmation/${emailtoken}`;

    //configure email content.
    const mailOptions = {
        from:'trueboy978@gmail.com',
        to: userEmail,
        subject: 'App Email verification',
        text: `Please click this email to confirm your email: ${url}`,
    }


    try {
       const result = await transporter.sendMail(mailOptions);
       console.log('Email sent successfully')
    } catch (error) {
        console.log('Email send failed with error:', error)
    }
}

export default sendMail