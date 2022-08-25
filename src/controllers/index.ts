import { FastifyRequest, FastifyReply } from 'fastify';
import { insertUrl, deleteUrl, returnLongUrl, returnShortUrl, redirectUrl } from '../services';
import { getFullUrl } from '../utils';

export function createUrlShortener(request: FastifyRequest) {
    const body = request.body as Record<string,string>
    return insertUrl(body.longUrl, getFullUrl(request))
}

export function deleteUrlShortener(request: FastifyRequest) {
    const body = request.body as Record<string,string>
    return deleteUrl(body.longUrl)
}

export function returnUrl(request: FastifyRequest) {
    const body = request.url
    if(body.includes(getFullUrl(request))) return returnLongUrl(body)
    return returnShortUrl(body)
}

export function baseShortener(request: FastifyRequest, response: FastifyReply) {
    const body = request.url
    return redirectUrl(body, response, getFullUrl(request))
}