# PingSpace Lite

## Description
PingSpace Lite is a lightweight, responsive team messaging application built with Node.js and Express 4. The server entry point in `server.js` serves static web assets from `public/` and exposes REST API endpoints for contacts, conversations, messaging, and search. Application state and message histories are persisted to `data/store.json` via `src/repositories/storeRepository.js`, which automatically seeds initial data from `src/data/seedData.js` on first boot. Core business operations are modularized into domain services: `src/services/contactService.js` resolves team members and active user context, `src/services/conversationService.js` manages conversation listings and unread counts, `src/services/messageService.js` handles chronological history retrieval and sending, and `src/services/searchService.js` performs query matching across contacts and message text.

## Repository Structure
```
.
├── challenge.json          # Challenge definition and runtime configuration
├── data/
│   └── store.json          # Persistent JSON datastore
├── package.json            # Dependencies and scripts
├── public/                 # Frontend client
│   ├── app.js              # Client state, DOM events, and API calls
│   ├── index.html          # Three-panel layout markup
│   └── styles.css          # Styling and responsive design
├── server.js               # Express server entry point
└── src/
    ├── controllers/        # Request handling and response formatting
    │   ├── contactController.js
    │   ├── conversationController.js
    │   └── searchController.js
    ├── data/
    │   └── seedData.js     # Initial seed dataset
    ├── middleware/
    │   └── errorHandler.js # Centralized API error middleware
    ├── repositories/
    │   └── storeRepository.js # JSON file storage operations
    ├── routes/             # API route endpoints
    │   ├── contactRoutes.js
    │   ├── conversationRoutes.js
    │   ├── healthRoutes.js
    │   └── searchRoutes.js
    └── services/           # Business logic layer
        ├── contactService.js
        ├── conversationService.js
        ├── messageService.js
        └── searchService.js
```

## Bugs and Bug Locations

1. Message Chronological Ordering
- Bug location: "src/services/messageService.js", within `getMessagesForConversation(conversationId)`.
- How to observe it: Open any conversation with multiple messages (such as Maya Chen / `conv-1`) or issue `GET /api/conversations/conv-1/messages`.
- Failure: The sort comparator reverses chronological order using `new Date(b.createdAt) - new Date(a.createdAt)`, rendering the newest message at the top of the chat history instead of the bottom.
- Expected: Messages should be sorted in ascending chronological order (`new Date(a.createdAt) - new Date(b.createdAt)`) so earlier messages appear first and recent messages appear at the bottom.

2. Unread Message Count Calculation
- Bug location: "src/services/conversationService.js", within `getConversationsWithMetadata()`.
- How to observe it: Inspect the conversation list when a conversation contains outgoing messages sent by the demo user that are unread by the recipient (such as Marcus Brody / `conv-4`), or send a new message in any conversation.
- Failure: The unread filter counts all messages where `!msg.readAt` without verifying that the author is not the current user (`msg.senderId !== currentUser.id`), causing the user's own sent messages to inflate their unread badge.
- Expected: Unread counts must only include incoming messages sent by contacts (`!msg.readAt && msg.senderId !== currentUser.id`).

3. Case-Insensitive Message Search
- Bug location: "src/services/searchService.js", within `search(query)`.
- How to observe it: Search with a lowercase string such as `"morning"` across messages containing capitalized text like `"Morning Alex..."` (`msg-201`), or issue `GET /api/search?q=morning`.
- Failure: The search query is converted to lowercase via `query.trim().toLowerCase()`, but message text is checked directly with `msg.text.includes(normalizedQuery)` without calling `.toLowerCase()`.
- Expected: Message search should be case-insensitive by checking `msg.text.toLowerCase().includes(normalizedQuery)`.

4. Conversation Selection and Message Filtering
- Bug location: "src/services/messageService.js", within `getMessagesForConversation(conversationId)`.
- How to observe it: Select Maya Chen (`conv-1`), then select Liam Vance (`conv-2`) in the conversation list, or request `GET /api/conversations/conv-2/messages` after `conv-1`.
- Failure: The cache check evaluates `this.lastConversationId && this.conversationCache.has(this.lastConversationId)` and returns `this.conversationCache.get(this.lastConversationId)`, returning the previous conversation's cached messages instead of the requested conversation.
- Expected: The cache lookup must check and retrieve messages strictly for the requested `conversationId` (`this.conversationCache.has(conversationId)`).
