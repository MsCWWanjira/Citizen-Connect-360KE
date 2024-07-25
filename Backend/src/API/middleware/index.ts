import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import path from 'path'
import dotenv from 'dotenv'
import { ExtendedRequest, UserPayload } from '../models/authModels'
dotenv.config({path:path.resolve(__dirname,"../../.env")})


export async function roleBasedToken (request:ExtendedRequest, response:Response, next:NextFunction){
    try{
        const token = request.headers['token'] as string

        if (!token){
            return response.status(401).send({message:"No access! Confirm your token to proceed"})
        } else {
            const decodedToken = jwt.verify(token, process.env.SECRET as string) as UserPayload
            request.info = decodedToken
        }

    } catch(error) {
        return response.status(401).send(error)
    }

    next()
} 