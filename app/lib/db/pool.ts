import { Pool } from 'pg';

const pool =
  process.env.NODE_ENV === 'production'
    ? new Pool({ connectionString: process.env.POSTGRES_URL })
    : new Pool({
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        port: parseInt(process.env.PGPORT as string, 10),
      });

export default pool;
