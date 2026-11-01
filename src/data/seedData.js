const initialUser = {
  id: 'user-alex',
  displayName: 'Alex Rivera',
  role: 'Product Lead',
  email: 'alex.rivera@pingspace.demo',
  avatarColor: '#4f46e5',
  initials: 'AR',
  createdAt: '2026-10-01T08:00:00.000Z'
};

const initialContacts = [
  {
    id: 'contact-1',
    displayName: 'Maya Chen',
    role: 'UX Designer',
    avatarColor: '#0ea5e9',
    initials: 'MC',
    status: 'online'
  },
  {
    id: 'contact-2',
    displayName: 'Liam Vance',
    role: 'Frontend Engineer',
    avatarColor: '#10b981',
    initials: 'LV',
    status: 'online'
  },
  {
    id: 'contact-3',
    displayName: 'Elena Rostova',
    role: 'Backend Architect',
    avatarColor: '#f59e0b',
    initials: 'ER',
    status: 'away'
  },
  {
    id: 'contact-4',
    displayName: 'Marcus Brody',
    role: 'Engineering Manager',
    avatarColor: '#8b5cf6',
    initials: 'MB',
    status: 'offline'
  },
  {
    id: 'contact-5',
    displayName: 'Sarah Jenkins',
    role: 'QA Lead',
    avatarColor: '#ec4899',
    initials: 'SJ',
    status: 'online'
  },
  {
    id: 'contact-6',
    displayName: 'David Kim',
    role: 'DevOps Specialist',
    avatarColor: '#14b8a6',
    initials: 'DK',
    status: 'offline'
  }
];

const initialConversations = [
  { id: 'conv-1', contactId: 'contact-1', createdAt: '2026-10-25T08:00:00.000Z' },
  { id: 'conv-2', contactId: 'contact-2', createdAt: '2026-10-25T08:30:00.000Z' },
  { id: 'conv-3', contactId: 'contact-3', createdAt: '2026-10-25T09:00:00.000Z' },
  { id: 'conv-4', contactId: 'contact-4', createdAt: '2026-10-25T09:30:00.000Z' },
  { id: 'conv-5', contactId: 'contact-5', createdAt: '2026-10-25T10:00:00.000Z' },
  { id: 'conv-6', contactId: 'contact-6', createdAt: '2026-10-25T10:30:00.000Z' }
];

const initialMessages = [
  {
    id: 'msg-101',
    conversationId: 'conv-1',
    senderId: 'contact-1',
    text: 'Hi Alex! Did you get a chance to review the new design prototypes?',
    createdAt: '2026-10-27T09:15:00.000Z',
    readAt: '2026-10-27T09:18:00.000Z'
  },
  {
    id: 'msg-102',
    conversationId: 'conv-1',
    senderId: 'user-alex',
    text: 'Hey Maya! Yes, just looked through them. The navigation updates look much cleaner.',
    createdAt: '2026-10-27T09:20:00.000Z',
    readAt: null
  },
  {
    id: 'msg-103',
    conversationId: 'conv-1',
    senderId: 'contact-1',
    text: 'Awesome, I will export the component tokens this afternoon for the frontend team.',
    createdAt: '2026-10-27T09:22:00.000Z',
    readAt: '2026-10-27T09:25:00.000Z'
  },
  {
    id: 'msg-201',
    conversationId: 'conv-2',
    senderId: 'contact-2',
    text: 'Morning Alex, quick heads up: the responsive layout refactor is ready for testing.',
    createdAt: '2026-10-27T10:05:00.000Z',
    readAt: null
  },
  {
    id: 'msg-202',
    conversationId: 'conv-2',
    senderId: 'contact-2',
    text: 'Can you verify if mobile message bubbles align properly on smaller viewports?',
    createdAt: '2026-10-27T10:08:00.000Z',
    readAt: null
  },
  {
    id: 'msg-301',
    conversationId: 'conv-3',
    senderId: 'contact-3',
    text: 'Alex, I updated the API response schemas to include unread counts.',
    createdAt: '2026-10-27T08:30:00.000Z',
    readAt: '2026-10-27T08:35:00.000Z'
  },
  {
    id: 'msg-302',
    conversationId: 'conv-3',
    senderId: 'user-alex',
    text: 'Looks solid Elena, thanks for keeping it consistent across all endpoints.',
    createdAt: '2026-10-27T08:45:00.000Z',
    readAt: null
  },
  {
    id: 'msg-303',
    conversationId: 'conv-3',
    senderId: 'contact-3',
    text: 'Let me know if we need indexing on the search query parameter.',
    createdAt: '2026-10-27T08:50:00.000Z',
    readAt: null
  },
  {
    id: 'msg-401',
    conversationId: 'conv-4',
    senderId: 'contact-4',
    text: 'Sprint planning is scheduled for 3 PM today. Please have your task estimates ready.',
    createdAt: '2026-10-26T14:00:00.000Z',
    readAt: '2026-10-26T14:10:00.000Z'
  },
  {
    id: 'msg-402',
    conversationId: 'conv-4',
    senderId: 'user-alex',
    text: 'Understood Marcus, PingSpace Lite checklist is all prepped.',
    createdAt: '2026-10-26T14:15:00.000Z',
    readAt: null
  },
  {
    id: 'msg-501',
    conversationId: 'conv-5',
    senderId: 'contact-5',
    text: 'Test suite is running cleanly. Looking forward to our release demo.',
    createdAt: '2026-10-26T11:00:00.000Z',
    readAt: '2026-10-26T11:05:00.000Z'
  }
];

module.exports = {
  initialUser,
  initialContacts,
  initialConversations,
  initialMessages
};
