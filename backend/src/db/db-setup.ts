import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  user: 'keyscribe',
  host: '52.168.92.118',
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
