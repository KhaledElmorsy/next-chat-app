import { NextRequest } from 'next/server';
import { pusherServer } from '@/app/(protected)/lib/pusher/server';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  if(!session) {
    return Response.error();
  }
  const userId = session?.user.id;
  const requestQuery = new URLSearchParams(await req.text());
  const socketId = requestQuery.get('socket_id') as string;
  const channelName = requestQuery.get('channel_name');
  if (channelName) {
    const authResponse = pusherServer.authorizeChannel(socketId, channelName);
    return Response.json(authResponse);
  }

  const authResponse = pusherServer.authenticateUser(socketId, {
    id: `${userId}`,
  });
  return Response.json(authResponse);
}
