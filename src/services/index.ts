import { PutItemInput, DeleteItemInput, ScanInput, GetItemInput } from 'aws-sdk/clients/dynamodb';
import * as base62 from 'base62-ts'
import { client } from '../config/index';

export const insertUrl = async (url: string) => {
    const uniqueId = Math.floor(Math.random() * Date.now())
    var params: PutItemInput = {
        TableName: "meli_shortener_db",
        Item: {
            "id": {S: uniqueId.toString()},
            "shortUrl": {S: `https://me.li/${base62.encode(uniqueId)}`},
            "longUrl": {S: url}
          }
    };

    const response = (await client.putItem(params).promise()).$response.httpResponse.statusCode;
    return response
}

export const deleteUrl = async(longUrl: string) => {
    var getItem: GetItemInput = {
        TableName: "meli_shortener_db",
        Key: { "longUrl": { "S": longUrl } }
    };



    const responseGet = (await client.getItem(getItem).promise()).$response;
    console.log(responseGet);


    var params: DeleteItemInput = {
        TableName: "meli_shortener_db",
        Key:{"longUrl" : {S: longUrl}}
    };
    const response = (await client.deleteItem(params).promise()).$response.httpResponse.statusCode;
    return response
}