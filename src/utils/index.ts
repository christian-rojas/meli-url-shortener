import { FastifyRequest } from 'fastify';
import { redisClient } from './redisClient';

export function getFullUrl(request: FastifyRequest){
    return request.protocol + '://' + request.hostname;
}

export async function checkIfKeyExists(url: string){
    const cachedResponse = await redisClient().get(url)
    console.log(cachedResponse);
	if(cachedResponse?.length) return cachedResponse
}