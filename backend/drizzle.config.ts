import { defineConfig } from 'drizzle-kit';
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
    out: './src/drizzle',
    schema: './src/drizzle/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
