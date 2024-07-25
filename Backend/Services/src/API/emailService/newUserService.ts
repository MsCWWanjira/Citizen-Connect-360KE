import dotenv from 'dotenv'
import path from 'path'
import { User, UserEmail } from '../models/userModel'
import { DbHelper } from '../databaseHelpers'
import { sendEmail } from '../helpers'
dotenv.config({path:path.resolve(__dirname,"../../.env")})


const db = new DbHelper()

export async function newUser(){
    try{        
      
        let users = (await db.get('getNewUser')).recordset as Array<User>        

        users.forEach( (user)=>{


    } catch(error) {
        console.log('Oops! error:',error)
    }
}}