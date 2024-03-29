import type { Pool } from 'pg';
import testData from './testData';

function stringify(d: unknown) {
  switch (typeof d) {
    case 'string':
      return `'${d}'`;
    case 'number':
      return `${d}`;
    case 'boolean':
      return `${d}`;
    default: 
     if(d === null) return 'null' 
  }
}

function getInsertQuery(tableName: string, data: Object[]) {
  const columns = Object.keys(data[0]);
  return `INSERT INTO ${tableName} (${columns.join(', ')})
  VALUES ${data.map(
    (point) => `(${Object.values(point).map(stringify).join(',')})`
  ).join(', ')};`;
}

export default async function insertData(pool: Pool) {
  // Users
  await pool.query(getInsertQuery('users', testData.users));

  // Conversations
  await pool.query(getInsertQuery('conversations', testData.conversations));

  // Memberships
  await pool.query(getInsertQuery('memberships', testData.memberships));

  // Messages
  await pool.query(getInsertQuery('messages', testData.messages));

  // Seen messages
  await pool.query(getInsertQuery('seen_messages', testData.seen_messages))
}
