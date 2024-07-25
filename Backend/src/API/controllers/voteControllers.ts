import {Request, Response } from 'express'
import {v4 as uid} from 'uuid' 
import path from 'path'
import dotenv from 'dotenv'
import { DbHelper } from '../databaseHelpers'
import { Poll } from '../models/pollModels'
import { voteSchema } from '../validation/voteValidation'
import { Votes } from '../models/voteModels'
dotenv.config({path:path.resolve(__dirname,"../../.env")})


const db = new DbHelper()

export async function addVote(request:Request,response:Response) {
    const id = uid()
    const {userId,pollId,choiceMade} = request.body
    const { error } = voteSchema.validate(request.body)

    try{
        if(error){
            return response.status(400).send(error.details[0].message)
        } else {

            await db.exec('addVote',{
                id: id,
                userId:userId,
                pollId:pollId,
                choiceMade:choiceMade
            })


            return response.status(200).send({message:"Congrats! Vote added successfuly!"})
        }

    } catch(error){
        return response.status(400).send(error)
    }
}


export async function getVotes (request:Request, response:Response){
    try{
        const votes = (await db.get('getVotes')).recordset as Array<Votes>
        console.log(votes)

        if(votes){
            
            return response.status(200).send(votes)
        } else {
            return response.status(200).send({message:'Oops! System currently has no votes'})
        }

    } catch(error) {
        return response.status(400).send(error)
    }

}


export async function getSpecificPollVotes (request:Request<{id:string}>,response:Response){
    try{
        const id = request.params.id
        const votes = (await db.exec('getSpecificPollVotes',{
            id:id
        })).recordset as Array<Votes>

        if (votes){

            return response.status(200).send(votes)
        } else {
            return response.status(200).send({message:"Oops! Poll does not exist. Review the id and try again?"})
        }


    } catch(error) {
        return response.status(400).send(error)
    }
}


export async function updateVote  (request:Request<{id:string}>,response:Response){
    try{
        const id = request.params.id
        const {choiceMade} = request.body
        const vote = (await db.exec('getVote',{
            id:id
        })).recordset[0] as Array<Votes>

        if (vote){

            db.exec('updateVote',{
                id: id,
                choiceMade:choiceMade
            })
 
            response.status(200).send({message:"Vote updated succesfully!"})

        } else {
            response.status(200).send({message:"Oops! Vote. Review the id and try again?"})
        }


    } catch(error) {
        return response.status(400).send(error)
    }
}


export async function deleteVote (request:Request<{id:string}>,response:Response){
    try{
        const id = request.params.id
        const poll = (await db.exec('getVote',{
            id:id
        })).recordset[0] as Array<Votes>
        
        if (poll){
            await db.exec('deleteVote',{
                id:id
            })

            response.status(200).send({message:"Vote succesfully deleted!"})
            
        } else {
            response.status(200).send({message:"Oops! Vote does not exist. Review the id and try again?"})
        }


    } catch(error) {
        return response.status(400).send(error)
    }}