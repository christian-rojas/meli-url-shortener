import { FastifyRequest } from 'fastify';
import { insertUrl, deleteUrl } from '../services';

export function createUrlShortener(request: FastifyRequest) {
    const body = request.body as Record<string,string>
    return insertUrl(body.longUrl)
}

export function deleteUrlShortener(request: FastifyRequest) {
    const body = request.body as Record<string,string>
    return deleteUrl(body.longUrl)
}