import nodemailer from 'nodemailer'
import path from 'path'
import dotenv from 'dotenv'
import { UserEmail } from '../models/userModel'
import { ConfigDetails } from '../models/configModel'
dotenv.config({path:path.resolve(__dirname,"../../.env")})


let configObject:any = {
    host: "smtp.gmail.com",
    service: "gmail",
    port: 587,
    auth :{
        user:process.env.MAIL_HOST,
        pass:process.env.SMTP_PASSWORD 
    }  
}

function createTransporter (configObject:any){   
    return nodemailer.createTransport(configObject)
}

export async function sendEmail(messageOption:UserEmail){
    let transporter = createTransporter(configObject)
    await transporter.verify()

    await transporter.sendMail(messageOption, (error,info)=>{
        if (error){
            console.log(error)
        } else {
            console.log(info)  
        }
    })
}