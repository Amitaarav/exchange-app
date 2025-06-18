import { Client } from 'pg';
import { createClient } from 'redis';  
import { DbMessage } from './types';
import dotenv from 'dotenv';

dotenv.config();

const pgClient = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: (process.env.POSTGRES_PORT as unknown as number),
});

pgClient.connect();

async function main() {
    const redisClient = createClient();
    await redisClient.connect();
    console.log("connected to redis");

    while (true) {
        const response = await redisClient.rPop("db_processor" as string)
        if (!response) {

        }  else {
            const data: DbMessage = JSON.parse(response);
            if (data.type === "TRADE_ADDED") {
                console.log("adding data");
                console.log(data);
                const price = data.data.price;
                const timestamp = new Date(data.data.timestamp);
                const query = 'INSERT INTO tata_prices (time, price) VALUES ($1, $2)';
                // TODO: How to add volume?
                const values = [timestamp, price];
                await pgClient.query(query, values);
            }
        }
    }

}

main();