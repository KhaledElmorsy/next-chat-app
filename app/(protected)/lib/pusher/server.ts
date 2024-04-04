import PusherServer from "pusher"

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  useTLS: true,
});
