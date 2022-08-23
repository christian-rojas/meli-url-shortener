import fastify from 'fastify'
import { createOrReturn, deleteRoute } from './src/routes'

const server = fastify()

// server.get('/ping', async (request, reply) => {
//   return 'pong\n'
// })


server.register(createOrReturn, { prefix: '/v1' })
server.register(deleteRoute, { prefix: '/v1' })

server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})