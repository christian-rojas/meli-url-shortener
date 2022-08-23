import { FastifyInstance } from 'fastify'
import { createUrlShortener, deleteUrlShortener } from '../controllers'

export function createOrReturn (fastify: FastifyInstance, opts: any, done: any) {
    fastify.post('/create', createUrlShortener)
    done()
}

export function deleteRoute (fastify: FastifyInstance, opts: any, done: any) {
    fastify.post('/delete', deleteUrlShortener)
    done()
}