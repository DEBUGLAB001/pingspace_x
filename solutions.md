# Solutions

### BUG-01: Messages Displayed in Reverse Order
- **Location:** `src/services/messageService.js`
- **Line:** 22
- **Correct Code:**
```javascript
convMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
```

### BUG-02: Incorrect Unread Message Counts
- **Location:** `src/services/conversationService.js`
- **Line:** 29
- **Correct Code:**
```javascript
const unreadCount = convMessages.filter(msg => !msg.readAt && msg.senderId !== currentUser.id).length;
```

### BUG-03: Case-Sensitive Message Search
- **Location:** `src/services/searchService.js`
- **Line:** 20
- **Correct Code:**
```javascript
.filter(msg => msg.text.toLowerCase().includes(normalizedQuery))
```

### BUG-04: Incorrect Conversation Switching
- **Location:** `src/services/messageService.js`
- **Lines:** 15-17
- **Correct Code:**
```javascript
if (this.conversationCache.has(conversationId)) {
  return this.conversationCache.get(conversationId);
}
```
