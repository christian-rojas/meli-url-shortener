import { createClient } from 'redis';

export const redisClient = () => {
    const client = createClient({socket: {keepAlive: 1}});
    client.connect();
    client.on('error', (err) => console.log('Redis Client Error', err));
    return client
}
