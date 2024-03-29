const testData = {
  users: [
    { id: 1, name: 'Khaled', email: 'khaled@gmail.com', image: 'rand.com' },
    { id: 2, name: 'Steve', email: 'steve@hotmail.com', image: 'rand.com' },
    { id: 3, name: 'Foo', email: 'foo@mail.com', image: 'rand.com' },
  ],
  conversations: [
    { id: 'khaledSteve', group_chat: false, name: null },
    { id: 'khaledFoo', group_chat: false, name: null },
    { id: 'groupChat', group_chat: true, name: 'the crew' },
    { id: 'khaledFooGroup', group_chat: true, name: 'Khaled & Foo' },
    { id: 'khaledSolo', group_chat: false, name: null },
  ],
  memberships: [
    { user_id: 1, conversation_id: 'khaledSteve' },
    { user_id: 2, conversation_id: 'khaledSteve' },
    { user_id: 1, conversation_id: 'khaledFoo' },
    { user_id: 3, conversation_id: 'khaledFoo' },
    { user_id: 1, conversation_id: 'groupChat' },
    { user_id: 2, conversation_id: 'groupChat' },
    { user_id: 3, conversation_id: 'groupChat' },
    { user_id: 1, conversation_id: 'khaledFooGroup' },
    { user_id: 3, conversation_id: 'khaledFooGroup' },
    { user_id: 1, conversation_id: 'khaledSolo' },
  ],
  messages: [
    {
      id: '1',
      body: 'hey',
      user_id: 1,
      conversation_id: 'khaledSteve',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      body: 'hi',
      user_id: 2,
      conversation_id: 'khaledSteve',
      createdAt: '2024-01-02',
    },
    {
      id: '3',
      body: 'hello',
      user_id: 3,
      conversation_id: 'khaledFoo',
      createdAt: '2024-01-01',
    },
    {
      id: '4',
      body: 'heyo',
      user_id: 1,
      conversation_id: 'groupChat',
      createdAt: '2024-01-01',
    },
    {
      id: '5',
      body: 'hey there',
      user_id: 2,
      conversation_id: 'groupChat',
      createdAt: '2024-03-01',
    },
  ],
  seen_messages: [
    { message_id: '1', user_id: 1 },
    { message_id: '2', user_id: 2 },
    { message_id: '2', user_id: 1 },
    { message_id: '3', user_id: 3 },
    { message_id: '4', user_id: 1 },
    { message_id: '5', user_id: 2 },
  ],
};

export default testData;
