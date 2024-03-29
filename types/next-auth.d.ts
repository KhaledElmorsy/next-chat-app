import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
    } & Omit<NonNullable<DefaultSession['user']>, 'id'>;
  }
}
