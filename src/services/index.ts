import {
	PutItemInput,
	ExecuteStatementInput,
	QueryInput,
} from 'aws-sdk/clients/dynamodb';
import * as base62 from 'base62-ts';
import { FastifyReply } from 'fastify';
import { client, dynamoTable } from '../config/index';
import { checkIfKeyExists } from '../utils';
import { redisClient } from '../utils/redisClient';

export const insertUrl = async (url: string, path: string) => {
	await checkIfKeyExists(url)
	const uniqueId = Math.floor(Math.random() * Date.now());
	const shortUrl = `${path}/${base62.encode(uniqueId)}`;
	const params: PutItemInput = {
		TableName: dynamoTable.tableName,
		Item: {
			id: { S: uniqueId.toString() },
			shortUrl: { S: shortUrl },
			longUrl: { S: url }
		},
		ConditionExpression: 'attribute_not_exists(longUrl)'
	};

	try {
		const response: any = (await client.putItem(params).promise()).$response.httpResponse.statusCode;
		if(response === 200) {
			await redisClient().set(url, shortUrl);
			await redisClient().set(shortUrl, url);
			return shortUrl
		};
	} catch (error: any) {
		await redisClient().set(url, `the input url ${url} exists ${error.message}`);
		return `the input url ${url} exists ${error.message}`;
	}
};

export const deleteUrl = async (longUrl: string) => {
	const statement: ExecuteStatementInput = {
		Statement: `
        DELETE FROM ${dynamoTable.tableName}
        WHERE "longUrl" = ?`,
		Parameters: [{ S: longUrl }]
	};
	const cachedResponse = await redisClient().get("del"+longUrl)
	if(!cachedResponse?.length) {
		try {
			const response = (await client.executeStatement(statement).promise()).$response.httpResponse;
			if(response.statusCode === 200){
				await redisClient().set("del"+longUrl, `url ${longUrl} does not exists anymore`);
				return `url ${longUrl} deleted`;
			}
		} catch (error) {
			return { message: `An error ocurred`, error}
		}
	}else{
		return redisClient().get("del"+longUrl);
	}
};

export const returnLongUrl = async (url: string) => {
	await checkIfKeyExists(url)
	const params: QueryInput = {
		TableName: dynamoTable.tableName,
		IndexName: dynamoTable.tableIndexName,
		KeyConditionExpression: 'shortUrl = :short',
		ExpressionAttributeValues: {
			':short': { S: url }
		},
		ProjectionExpression: 'longUrl'
	};
	try {
		const response: any = (await client.query(params).promise()).$response
			.httpResponse;
		if(response.statusCode) {
			const res = Buffer.from(response.body, 'base64').toString();
			const { Items } = JSON.parse(res);
			const longUrl = Items[0].longUrl.S
			await redisClient().set(url, longUrl );
			return longUrl;
		} 
	} catch (error) {
		return 'An error ocurred' + error
	}
};

export const returnShortUrl = async (url: string) => {
	await checkIfKeyExists(url)
	const params: QueryInput = {
		TableName: dynamoTable.tableName,
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
        if(Items.length) return Items[0].shortUrl.S
        return { message: "no items found" }
    } catch (error) {
        return { message: "an error ocurred", error }
    }
};

export const redirectUrl = async (url: string, reply: FastifyReply, path: string) => {
	const cachedResponse = await redisClient().get(`${path}${url}`)
	if(cachedResponse) {
		reply.redirect(302, cachedResponse);
	}
	const params: QueryInput = {
		TableName: dynamoTable.tableName,
		IndexName: dynamoTable.tableIndexName,
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
