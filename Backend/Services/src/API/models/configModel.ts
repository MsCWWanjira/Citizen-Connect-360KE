export interface ConfigDetails {
    host: string,
    service: string,
    port: number,
    auth :{
        user?:string,
        pass?:string 
    }
}