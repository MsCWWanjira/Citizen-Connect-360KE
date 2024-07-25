import {Request, Response } from 'express'
import {stringify, v4 as uid} from 'uuid' 
import path from 'path'
import dotenv from 'dotenv'
import { DbHelper } from '../databaseHelpers'
import { pollSchema } from '../validation/pollValidation'
import { Poll } from '../models/pollModels'
dotenv.config({path:path.resolve(__dirname,"../../.env")})


const db = new DbHelper()

export async function addPoll(request:Request,response:Response) {
    const id = uid()
    const {title,userId,choices} = request.body
    const choicesString = choices.join(",")
    const { error } = pollSchema.validate(request.body)
    try{
        if(error){
            return response.status(400).send(error.details[0].message)
        } else {
            await db.exec('addPoll',{
                id: id,
                userId:userId,
                title:title,
                choices:choicesString
            })

            return response.status(200).send({message:"Congrats! You have succesfully created a new poll"})
        }

    } catch(error){
        return response.status(400).send(error)
    }
}


export async function getPolls (request:Request, response:Response){
    try{
        const polls = (await db.get('getpolls')).recordset as Array<Poll>
        if(polls){
            return response.status(200).send(polls)
        } else {
            return response.status(200).send({message:'Oops! System currently has no polls'})
        }

    } catch(error) {
        return response.status(400).send(error)
    }

}


export async function getPoll (request:Request<{id:string}>,response:Response){
    try{
        const id = request.params.id
        const poll = (await db.exec('getPoll',{
            id:id
        })).recordset as Array<Poll>
        console.log(poll[0].choices)

        if (poll){
            return response.status(200).send(poll)
        } else {
            return response.status(200).send({message:"Oops! Poll does not exist. Review the id and try again?"})
        }


    } catch(error) {
        return response.status(400).send(error)
    }
}

export async function closePoll  (request:Request<{id:string}>,response:Response){
    try{
        const id = request.params.id
        const poll = (await db.exec('getPoll',{
            id:id
        })).recordset[0] as Array<Poll>


        if (poll){

            db.exec('closePoll',{
                id:id
            })

            response.status(200).send({message:"Poll closed!"})

        } else {
            response.status(200).send({message:"Oops! Poll does not exist. Review the id and try again?"})
        }


    } catch(error) {
        return response.status(400).send(error)
    }
}



export async function deletePoll (request:Request<{id:string}>,response:Response){
    try{
        const id = request.params.id
        const poll = (await db.exec('getPoll',{
            id:id
        })).recordset[0] as Array<Poll>
        
        if (poll){
            await db.exec('deletePoll',{
                id:id
            })
            response.status(200).send({message:"Poll deleted succesfully!"})
        } else {
            response.status(200).send({message:"Oops! Poll does not exist. Review the id and try again?"})
        }
    } catch(error) {
        return response.status(400).send(error)
    }
}