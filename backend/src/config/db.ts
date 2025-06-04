import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv"
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
};

const pool = mysql.createPool(dbConfig);
// console.log('Database pool initialized at', new Date().toISOString());
// pool.on('connection', () => {
//     console.log('New database connection created at', new Date().toISOString());
// });
export const db = drizzle(pool);