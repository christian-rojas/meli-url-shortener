import { DynamoDB } from 'aws-sdk';
import https from 'https'

const agent = new https.Agent({
  keepAlive: true, 
  maxSockets: Infinity,
});

// export const client = new DynamoDB({
//     credentials: 
//     {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
//     },
//     region: process.env.AWS_DEFAULT_REGION as string,
//     httpOptions: {agent}
// })

export const dynamoTable = {
    tableName: process.env.TABLE_NAME as string,
    tableIndexName: process.env.TABLE_INDEX_NAME as string
}

export const client = new DynamoDB({region: 'us-east-1', httpOptions: {agent}})