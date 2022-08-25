import { FastifyRequest, FastifyReply } from 'fastify';
import { insertUrl, deleteUrl, base } from '../services';

export function createUrlShortener(request: FastifyRequest) {
    const body = request.body as Record<string,string>
    return insertUrl(body.longUrl)
}

export function deleteUrlShortener(request: FastifyRequest) {
    const body = request.body as Record<string,string>
    return deleteUrl(body.longUrl)
}

export function baseShortener(request: FastifyRequest, response: FastifyReply) {
    const body = request.url
    return base(body, response)
}