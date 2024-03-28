import { NextRequest } from 'next/server';
import { searchUser, pool } from '@/app/lib/db';
import { UserSearchSchema } from '@/app/lib/validation/user';


export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const term = searchParams.get('query');

  const users = await searchUser.run({ term }, pool);
  const parsedUsers = UserSearchSchema.array().parse(users);
  return Response.json(parsedUsers);
}
