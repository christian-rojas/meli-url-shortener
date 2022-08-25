import { FastifyInstance } from 'fastify'
import { baseShortener, createUrlShortener, deleteUrlShortener, returnUrl } from '../controllers'

export function createOrReturn (fastify: FastifyInstance, opts: any, done: any) {
    fastify.post('/create', createUrlShortener)
    done()
}

export function deleteRoute (fastify: FastifyInstance, opts: any, done: any) {
    fastify.post('/delete', deleteUrlShortener)
    done()
}

export function returnUrlRoute (fastify: FastifyInstance, opts: any, done: any) {
    fastify.post('/urls', returnUrl)
    done()
}

export function redirectRoute (fastify: FastifyInstance, opts: any, done: any) {
    fastify.get('/:base', baseShortener)
    done()
}