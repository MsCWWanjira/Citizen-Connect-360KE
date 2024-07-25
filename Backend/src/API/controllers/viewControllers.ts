import {Request, Response } from 'express'
import {v4 as uid} from 'uuid' 
import path from 'path'
import dotenv from 'dotenv'
import { DbHelper } from '../databaseHelpers'
import { viewSchema } from '../validation/viewValidation'
import { View } from '../models/viewModels'
dotenv.config({path:path.resolve(__dirname,"../../.env")})


const db = new DbHelper()

export async function addView(request:Request,response:Response) {
    const id = uid()
    const {title,description,body,location,userId,imageUrl} = request.body

    const { error } = viewSchema.validate(request.body)

    try{
        if(error){
            return response.status(400).send(error.details[0].message)
        } else {

            await db.exec('addView',{
                id: id,
                title:title,
                description:description,
                body:body,
                location:location,
                userId:userId,
                imageUrl:imageUrl
            })

            return response.status(200).send({message:"Congrats! New view created successfully"})
        }
    } catch(error){
        return response.status(400).send(error)
    }
}


export async function getViews (request:Request, response:Response){
    try{
        const views = (await db.get('getViews')).recordset as Array<View>
        if(views){
            return response.status(200).send(views)
        } else {
            return response.status(200).send({message:'Oops! System currently has no views'})
        }

    } catch(error) {
        return response.status(400).send(error)
    }

}


export async function getView (request:Request<{id:string}>,response:Response){
    try{
        const id = request.params.id
        const view = (await db.exec('getView',{
            id:id
        })).recordset[0] as Array<View>
        if (view){

            return response.status(200).send(view)

        } else {
            return response.status(200).send({message:"Oops! View does not exist. Review the id and try again?"})
        }


    } catch(error) {
        return response.status(400).send(error)
    }
}


export async function updateView  (request:Request<{id:string}>,response:Response){
    try{
        const id = request.params.id
        const {title,description,body,location,userId,imageUrl} = request.body

        const view = (await db.exec('getView',{
            id:id
        })).recordset[0] as Array<View>


        if (view){

            db.exec('updateview',{
                id: id,
                title:title,
                description:description,
                body:body,
                location:location,
                userId:userId,
                imageUrl:imageUrl
            })

            response.status(200).send({message:"View updated succesfully!"})

        } else {
            response.status(200).send({message:"Oops! View does not exist. Review the id and try again?"})
        }


    } catch(error) {
        return response.status(400).send(error)
    }}



export async function deleteView (request:Request<{id:string}>,response:Response){
    try{
        const id = request.params.id
        const view = (await db.exec('getView',{
            id:id
        })).recordset[0] as Array<View>
        
        if (view){
            await db.exec('deleteView',{
                id:id
            })

            response.status(200).send({message:"View deleted succesfully!"})
            
        } else {
            response.status(200).send({message:"Oops! View does not exist. Review the id and try again?"})
        }


    } catch(error) {
        return response.status(400).send(error)
    }
}