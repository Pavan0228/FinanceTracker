import pkg from 'redis';  
const { createClient } = pkg;

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', err => console.log('Redis Client Error', err));
await client.connect();

export default client;