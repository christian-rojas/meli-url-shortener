import { FastifyRequest } from 'fastify';

export function getFullUrl(request: FastifyRequest){
    return request.protocol + '://' + request.hostname;
}