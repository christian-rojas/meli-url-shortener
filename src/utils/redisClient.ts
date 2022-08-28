
import { createClient } from 'redis';

export const redisClient = () => {

    const client = createClient(
{
  socket: {
    port: 6379,
    host: '54.165.94.29'
  }
}
);
    client.connect();
    client.on('error', (err) => console.log('Redis Client Error', err));
    return client
    // return new Redis({
    //     host: "redis://meli-cluster-redis.4cbxvl.ng.0001.use1.cache.amazonaws.com", // rename the credentials `hostname` to `host`
    //     port: 6379,
    //     connectTimeout: 10000
    // });
}
