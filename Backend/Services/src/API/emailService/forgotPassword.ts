import dotenv from 'dotenv'
import path from 'path'
import { User, UserEmail } from '../models/userModel'
import { DbHelper } from '../databaseHelpers'
import { sendEmail } from '../helpers'
dotenv.config({path:path.resolve(__dirname,"../../.env")})


const db = new DbHelper()

export async function forgotPassword(){
    try{       
        let users = (await db.get('getActivatedPasswordReset')).recordset as Array<User>        
        
  
        users.forEach( (user)=>{

        })
        console.log('Password reset emails have succesfully been sent out!')
        }
    }