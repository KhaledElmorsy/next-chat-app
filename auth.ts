import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [Google],
  callbacks: {
    authorized({auth, request: {nextUrl}}) {
      if(auth) return true;
      return Response.redirect(new URL('/', nextUrl))
    }
  }
});
