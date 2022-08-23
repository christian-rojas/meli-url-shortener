import { DynamoDB } from 'aws-sdk';

export const client = new DynamoDB({
    credentials: 
        {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_SECRET_ACCES_KEY as string,
        },
    region: process.env.AWS_DEFAULT_REGION as string
})