import { FastifyInstance } from 'fastify'
import { createUrlShortener, deleteUrlShortener, baseShortener } from '../controllers'

export function createOrReturn (fastify: FastifyInstance, opts: any, done: any) {
    fastify.post('/create', createUrlShortener)
    done()
}

export function deleteRoute (fastify: FastifyInstance, opts: any, done: any) {
    fastify.post('/delete', deleteUrlShortener)
    done()
}

export function base (fastify: FastifyInstance, opts: any, done: any) {
    fastify.get('/:base', baseShortener)
    done()
}