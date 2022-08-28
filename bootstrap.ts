import fastify, { FastifyInstance } from 'fastify';
import AWS from 'aws-sdk';
import { createOrReturn, deleteRoute, redirectRoute, returnUrlRoute } from './src/routes';
import { client } from './src/config';

export async function bootstrap(): Promise<FastifyInstance> {
  const app: FastifyInstance = fastify({
    logger: false,
  });

  AWS.config.update({
    region: 'us-east-1',
    // secretName = "secret/newrelic",
  });
  app.decorate('dynamo', ()=>client)
  
  app.register(createOrReturn, { prefix: '/v1' })
  app.register(deleteRoute, { prefix: '/v1' })
  app.register(returnUrlRoute, { prefix: '/v1' })
  
  app.register(redirectRoute)
  
  app.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })

  return app;
}
