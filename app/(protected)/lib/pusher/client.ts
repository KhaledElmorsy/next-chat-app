import Pusher from 'pusher-js';

export const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  userAuthentication: {
    endpoint: '/api/pusher/auth',
    transport: 'ajax',
  },
  channelAuthorization: {
    endpoint: '/api/pusher/auth',
    transport: 'ajax'
  }
});

pusherClient.signin();
