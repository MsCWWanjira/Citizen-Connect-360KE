import { ConnectionPool, Request } from "mssql";
import mssql from 'mssql'
import { sqlConfig } from "../../config";

export class DbHelper{ 
    private pool :Promise<ConnectionPool>
    constructor() {

        this.pool= mssql.connect(sqlConfig) 
    }

    private createRequest(emptyRequest:Request, data:{[x:string]: string|number}){
        const keys = Object.keys(data)
        keys.map(key=>{
            emptyRequest.input(key, data[key])
        })
        return emptyRequest
    }

    async exec(storedprocedure:string, data:{[x:string]: string|number}){
        const emptyRequest= (await this.pool).request()
        const request=this.createRequest(emptyRequest,data)
        let results= (await request.execute(storedprocedure))
        return results
    }
    
    async get(storedProcedure: string) {
        const request = (await this.pool).request();
        const results = await request.execute(storedProcedure);
        return results;
      }
}