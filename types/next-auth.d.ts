import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
    } & Omit<DefaultSession['user'], 'id'>;
  }
}
