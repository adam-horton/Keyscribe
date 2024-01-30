import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  user: 'keyscribe',
  host: 'ec2-3-86-40-33.compute-1.amazonaws.com',
  database: 'ks_db',
  password: process.env.DB_PASSWORD!,
  port: 5432, // Default PostgreSQL port
  ssl: false,
});

const queryPool = async (query: string, args: any[]): Promise<QueryResult<any>> => pool.query(query, args);

const getPool = () => pool;

export {
  queryPool,
  getPool,
};
