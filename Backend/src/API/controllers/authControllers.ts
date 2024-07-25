import {Request, Response } from 'express'
import {v4 as uid} from 'uuid' 
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import path from 'path'
import dotenv from 'dotenv'
import { DbHelper } from '../databaseHelpers'
import { changePasswordSchema, forgotPasswordSchema, registerSchema } from '../validation/authValidation'
import { Roles, User, UserPayload } from '../models/authModels'
dotenv.config({path:path.resolve(__dirname,"../../.env")})


const db = new DbHelper()


export async function registerUser(request:Request,response:Response) {
    const id = uid()
    const role = Roles.Citizen
    const {name,email,password,acceptTos} = request.body  
    const { error } = registerSchema.validate(request.body, {
        abortEarly:false,
    })

    try{
        if(error){
            return response.status(400).send(error.details[0].message)
        } else {
            const hashedPassword = await bcrypt.hash(password,9)    
            
            await db.exec('addUser',{
                id: id,
                name:name,
                email: email,
                password:hashedPassword,
                role:role
            })

            const payload:UserPayload = {
                id: id,
                name: name,
                email: email,
                role: role
            }

            return response.status(200).send({message:"You have succesfully created a new account"})
        }

    } catch(error){
        return response.status(400).send(error)
    }
}


export async function loginUser (request:Request, response:Response){
    try{
        const {email,password} = request.body
        const user = (await db.exec('getUserByEmail',{
            email:email
        })).recordset as Array<User>   

        if(user){
          
            const isValid = await bcrypt.compare(password,user[0].password)
            if(isValid){
                const payload:UserPayload = {
                    id: user[0].id,
                    name: user[0].name,
                    email:user[0].email,
                    role: user[0].role
                }

                const token = jwt.sign(payload,process.env.SECRET as string,{expiresIn:'20d'})
                const decodedToken = jwt.verify(token, process.env.SECRET as string) as UserPayload
                return response.status(200).send({message:"You are logged in succesfully!",token:token,decodedToken:decodedToken})
            } else{

                return response.status(400).send({message:"Invalid password. Try again?"})
            }
        }

    } catch(error){
        return response.status(400).send({message:"Oops! The email does not exist.Enter a different one"})
    }
} 


export async function changePassword (request:Request<{id:string}>, response:Response){
    
    const id = request.params.id
    const {newPassword, confirmNewPassword} = request.body
    const { error } = changePasswordSchema.validate(request.body)

    try{
        if(error){
            return response.status(400).send(error.details[0].message)
        } else {

            const user = (await db.exec('getUserById',{
                id:id
            })).recordset as Array<User>


            if(user){
                const newHashedPassword = await bcrypt.hash(confirmNewPassword,9)
    
                await db.exec('updatePassword',{
                    id: user[0].id,
                    password:newHashedPassword,
                })
               

                return response.status(200).send({message:"Password updated succesfully!"})
              
            } else {
                return response.status(400).send({message:"Oops! Could not find user. Review the id and try again?"}) 
            }
    
        }
    } catch(error){
        return response.status(400).send(error)
    }
}



export async function forgotPassword (request:Request, response:Response){
    
    const {email} = request.body
    const { error } = forgotPasswordSchema.validate(request.body)

    try{
        if(error){
            return response.status(400).send(error.details[0].message)
        } else {

            const user = (await db.exec('getUserByEmail',{
                email:email
            })).recordset as Array<User>


            if(user){
    
                await db.exec('activatePasswordReset',{
                    id: user[0].id
                })

                return response.status(200).send({message:"A password reset link will be sent to you shortly"})
    
            } else {
                return response.status(400).send({message:"Oops! Looks like that user doesn't exist. Try again?"}) 
            }
    
        }
    } catch(error){
        return response.status(400).send(error)
    }
}


export async function getUsers (request:Request, response:Response){
    try{
        const users = (await db.get('getUsers')).recordset as Array<User>

        if(users){
            
            return response.status(200).send(users)
        } else {
            return response.status(200).send({message:'Oops! The system currently has no users'})
        }

    } catch(error) {
        return response.status(400).send(error)
    }

}


export async function getUserById (request:Request<{id:string}>,response:Response){
    try{
        const id = request.params.id
        const user = (await db.exec('getUserById',{
            id:id
        })).recordset[0] as Array<User>


        if (user ){
            return response.status(200).send(user)

        } else {
            return response.status(200).send({message:"Oops! User doesn't exist. Review the id and try again?"})
        }


    } catch(error) {
        return response.status(400).send(error)
    }
}

export async function getUserByEmail (request:Request,response:Response){
    const {email} = request.body

    try{
        const user = (await db.exec('getUserByEmail',{
            email:email
        })).recordset[0] as Array<User>
        console.log(user)

        if (user ){
            return response.status(200).send(user)

        } else {
            return response.status(200).send({message:"Oops! User doesn't exist. Review the email and try again?"})
        }


    } catch(error) {
        return response.status(400).send(error)
    }
}


export async function updateUser  (request:Request<{id:string}>,response:Response){
    try{
        const id = request.params.id
        const {name,email,password} = request.body
        const role = Roles.Citizen

        const user = (await db.exec('getUserById',{
            id:id
        })).recordset[0] as Array<User>


        if (user){
            const hashedPassword = await bcrypt.hash(password, 9)

            db.exec('updateUser',{
                id: id,
                name: name,
                email:email,
                password:hashedPassword,
                role:role
            })

            response.status(200).send({message:"User updated succesfully!"})

        } else {
            response.status(200).send({message:"Oops! User does not exist. Review the id and try again?"})
        }


    } catch(error) {
        response.status(400).send(error)
    }
}



export async function deleteUser (request:Request<{id:string}>,response:Response){
    try{
        const id = request.params.id
        const user = (await db.exec('getUserById',{
            id:id
        })).recordset[0] as Array<User>
        
        if (user){
            await db.exec('deleteUser',{
                id:id
            })

            response.status(200).send({message:"User deleted succesfully!"})
            
        } else {
            response.status(200).send({message:"Oops! User does not exist. Review the id and try again?"})
        }


    } catch(error) {
        response.status(400).send(error)
    }
}