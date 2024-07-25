import {Request} from 'express'

export enum Roles {
    Citizen = 'citizen',
    Official = 'official',
    Admin = 'admin'
}

export interface User{
    id:string,
    name:string,
    email:string,
    password:string,
    role:string,
    avatar?:string,
    isEmailSent?:number,
    isDeleted?:number,
    awaitApproval?:number
}

export interface UserPayload{
    id: string,
    name: string,
    email:string,
    role:string
}

export interface ExtendedRequest extends Request{
    info?: UserPayload
}