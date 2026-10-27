const request = require('supertest');
const { createApp } = require('../server');
const storeRepository = require('../src/repositories/storeRepository');
const messageService = require('../src/services/messageService');

const app = createApp();

beforeEach(() => {
  storeRepository.reset();
  messageService.clearCache();
});

// Bug 1: Array Sorting and Chronological Ordering
test('test_message_chronological_ordering', async () => {
  const res = await request(app).get('/api/conversations/conv-1/messages');
  expect(res.status).toBe(200);
  expect(res.body.length).toBeGreaterThan(1);

  for (let i = 0; i < res.body.length - 1; i++) {
    const timeCurrent = new Date(res.body[i].createdAt).getTime();
    const timeNext = new Date(res.body[i + 1].createdAt).getTime();
    expect(timeCurrent).toBeLessThanOrEqual(timeNext);
  }
});

// Bug 2: Unread Counting Logic and Array Filtering
test('test_unread_count_calculation', async () => {
  // In conv-4: msg-401 is incoming read, msg-402 is outgoing by user-alex
  // Incoming unread count should be 0
  const res = await request(app).get('/api/conversations');
  expect(res.status).toBe(200);
  const conv4 = res.body.find(c => c.id === 'conv-4');
  expect(conv4).toBeDefined();
  expect(conv4.unreadCount).toBe(0);
});

// Bug 3: Case-Insensitive String Processing and Search
test('test_case_insensitive_message_search', async () => {
  // msg-201 contains 'Morning Alex'
  // Searching lowercase 'morning' must match
  const res = await request(app).get('/api/search?q=morning');
  expect(res.status).toBe(200);
  expect(res.body.messages).toBeDefined();
  const found = res.body.messages.find(m => m.id === 'msg-201');
  expect(found).toBeDefined();
});

// Bug 4: Hash Maps and Conversation Selection
test('test_conversation_selection_and_message_filtering', async () => {
  const res1 = await request(app).get('/api/conversations/conv-1/messages');
  expect(res1.status).toBe(200);
  const conv1MessageIds = res1.body.map(m => m.id);

  const res2 = await request(app).get('/api/conversations/conv-2/messages');
  expect(res2.status).toBe(200);
  const conv2MessageIds = res2.body.map(m => m.id);

  // conv-2 must return its own messages, not conv-1 messages
  expect(conv2MessageIds).toContain('msg-201');
  expect(conv2MessageIds).not.toContain(conv1MessageIds[0]);
});
