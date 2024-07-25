import {Request, Response } from 'express'
import {v4 as uid} from 'uuid' 
import path from 'path'
import dotenv from 'dotenv'

import { DbHelper } from '../databaseHelpers'
import { incidentSchema } from '../validation/incidentValidation'
import { Incident } from '../models/incidentModels'
dotenv.config({path:path.resolve(__dirname,"../../.env")})


const db = new DbHelper()

export async function addIncident(request:Request,response:Response) {
    const id = uid()
    const {title,description,body,location,userId,imageUrl} = request.body
    console.log(title,imageUrl)

    const { error } = incidentSchema.validate(request.body)

    try{
        if(error){
            return response.status(400).send(error.details[0].message)
        } else {

            await db.exec('addIncident',{
                id: id,
                title:title,
                description:description,
                body:body,
                location:location,
                userId:userId,
                imageUrl:imageUrl
            })


            return response.status(200).send({message:"Congrats! You succesfully created a new incident"})
        }

    } catch(error){
        return response.status(400).send(error)
    }
}


export async function getIncidents (request:Request, response:Response){
    try{
        const incidents = (await db.get('getIncidents')).recordset as Array<Incident>

        if(incidents){
            
            return response.status(200).send(incidents)
        } else {
            return response.status(200).send({message:'System currently has no incidents'})
        }

    } catch(error) {
        return response.status(400).send(error)
    }

}


export async function getIncident (request:Request<{id:string}>,response:Response){
    try{
        const id = request.params.id
        const incident = (await db.exec('getIncident',{
            id:id
        })).recordset[0] as Array<Incident>

        if (incident){
 
            return response.status(200).send(incident)
        } else {
            return response.status(200).send({message:"Oops! Incident id does not exist. Review the id and try again?"})
        }


    } catch(error) {
        return response.status(400).send(error)
    }
}


export async function deleteIncident (request:Request<{id:string}>,response:Response){
    try{
        const id = request.params.id
        const incident = (await db.exec('getIncident',{
            id:id
        })).recordset[0] as Array<Incident>
        
        if (incident){
            await db.exec('deleteIncident',{
                id:id
            })

            response.status(200).send({message:"Incident deleted succesfully!"})
            
        } else {
            response.status(200).send({message:"Oops! Incident does not exist. Review the id and try again?"})
        }


    } catch(error) {
        return response.status(400).send(error)
    }
}