import express from 'express'
import cron from 'node-cron'
import { newUser } from '../API/emailService/newUserService';
import { forgotPassword } from '../API/emailService/forgotPassword';

const app = express()

cron.schedule('*/5 * * * * *', async () => {
 
    await newUser()
    await forgotPassword()

});


app.listen(4001,()=>{
    console.log('Server is up and running!')
})