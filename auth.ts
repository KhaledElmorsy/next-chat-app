import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import pool from '@/app/lib/db/pool';
import PostgresAdapter from '@auth/pg-adapter';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [Google],
});
