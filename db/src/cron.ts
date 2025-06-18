import { Client } from 'pg'; 
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: (process.env.POSTGRES_PORT as unknown as number),
});

client.connect();

async function refreshViews() {

    await client.query('REFRESH MATERIALIZED VIEW klines_1m');
    await client.query('REFRESH MATERIALIZED VIEW klines_1h');
    await client.query('REFRESH MATERIALIZED VIEW klines_1w');

    console.log("Materialized views refreshed successfully");
}

refreshViews().catch(console.error);

setInterval(() => {
    refreshViews()
}, 1000 * 10 );