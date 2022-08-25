import {
	PutItemInput,
	ExecuteStatementInput,
	QueryInput,
} from 'aws-sdk/clients/dynamodb';
import * as base62 from 'base62-ts';
import { FastifyReply } from 'fastify';
import { client } from '../config/index';

export const insertUrl = async (url: string, path: string) => {
	const uniqueId = Math.floor(Math.random() * Date.now());
	const shortUrl = `${path}/${base62.encode(uniqueId)}`;
	var params: PutItemInput = {
		TableName: 'meli_shortener',
		Item: {
			id: { S: uniqueId.toString() },
			shortUrl: { S: shortUrl },
			longUrl: { S: url }
		},
		ConditionExpression: 'attribute_not_exists(longUrl)'
	};
	try {
		const response: any = (await client.putItem(params).promise()).$response.httpResponse.statusCode;
		return response === 200 && shortUrl;
	} catch (error) {
		return { message: `the input url ${url} exists`, error: `${error}` };
	}
};

export const deleteUrl = async (longUrl: string) => {
	const statement: ExecuteStatementInput = {
		Statement: `
        DELETE FROM "meli_shortener"
        WHERE "longUrl" = ?`,
		Parameters: [{ S: longUrl }]
	};
    try {
        const response: any = (await client.executeStatement(statement).promise())
            .$response.httpResponse;
        return response.statusCode;
    } catch (error) {
        return { message: `An error ocurred`, error}
    }
};

export const returnLongUrl = async (url: string) => {
	const params: QueryInput = {
		TableName: 'meli_shortener',
		IndexName: 'shortUrl-index',
		KeyConditionExpression: 'shortUrl = :short',
		ExpressionAttributeValues: {
			':short': { S: url }
		},
		ProjectionExpression: 'longUrl'
	};

	const response: any = (await client.query(params).promise()).$response
		.httpResponse.body;
	const res = Buffer.from(response, 'base64').toString();
	const { Items } = JSON.parse(res);
	return Items[0].shortUrl.S;
};

export const returnShortUrl = async (url: string) => {
	const params: QueryInput = {
		TableName: 'meli_shortener',
		KeyConditionExpression: 'longUrl = :long',
		ExpressionAttributeValues: {
			':long': { S: url }
		}
	};
    try {
        const response: any = (await client.query(params).promise()).$response
            .httpResponse.body;
        const parsedResponse = Buffer.from(response, 'base64').toString();
        const { Items } = JSON.parse(parsedResponse);
        if(Items.length) return Items[0].longUrl.S
        return { message: "no items found" }
    } catch (error) {
        return { message: "an error ocurred", error }
    }
};

export const redirectUrl = async (url: string, reply: FastifyReply, path: string) => {
	const params: QueryInput = {
		TableName: 'meli_shortener',
		IndexName: 'shortUrl-index',
		KeyConditionExpression: 'shortUrl = :short',
		ExpressionAttributeValues: {
			':short': { S: `${path}${url}` }
		},
		ProjectionExpression: 'longUrl'
	};
    try {
        const response: any = (await client.query(params).promise()).$response
            .httpResponse.body;
        const res = Buffer.from(response, 'base64').toString();
        const { Items } = JSON.parse(res);
        if (Items.length) {
            reply.redirect(302, Items[0].longUrl.S);
        }
        return { message: "no items found" }
    } catch (error) {
        return { message: "an error ocurred", error }
    }
};
