import { PutItemInput, UpdateItemInput, DeleteItemInput, ScanInput, GetItemInput, ExecuteStatementInput, QueryInput, DeleteRequest } from 'aws-sdk/clients/dynamodb';
import * as base62 from 'base62-ts'
import { FastifyReply } from 'fastify';
import { client } from '../config/index';

export const insertUrl = async (url: string) => {
    const uniqueId = Math.floor(Math.random() * Date.now())
    const shortUrl = `https://me.li/${base62.encode(uniqueId)}`
    var params: PutItemInput = {
        TableName: "meli_shortener_db",
        Item: {
            "id": {S: uniqueId.toString()},
            "shortUrl": {S: shortUrl},
            "longUrl": {S: url}
        },
    };

    const response = (await client.putItem(params).promise()).$response.httpResponse;
    
    
    return response.statusCode === 200 ? shortUrl : {message: `error: ${response.body}`}
}

export const deleteUrl = async(longUrl: string) => {
    const statement : ExecuteStatementInput = {
        Statement: `
        DELETE FROM "meli_shortener_db"
        WHERE "shortUrl" = ?`,
        Parameters: [{ S: longUrl }],
    }


    const response = (await client.executeStatement(statement).promise()).$response.httpResponse;

    return response.statusCode
}

export const base = async (base: string, reply: FastifyReply) =>{
    const input : GetItemInput = {
        Key: { shortUrl:  {S: 'https://me.li/ccZXb69'}},
        TableName: "meli_shortener_db"
    }
    const response: any = (await client.getItem(input).promise()).$response.data;
    if(response.Item){
        console.log(response.Item.longUrl.S);
        reply.redirect(302, 'https://'+response.Item.longUrl.S);
    }
}