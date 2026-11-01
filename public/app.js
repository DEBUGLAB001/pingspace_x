// PingSpace Lite - Frontend Application

(function () {
  'use strict';

  // State
  let currentUser = null;
  let currentTab = 'conversations'; // 'conversations' | 'contacts' | 'search'
  let activeConversationId = null;
  let activeContact = null;
  let conversations = [];
  let contacts = [];
  let searchResults = null;
  let isSending = false;
  let conversationFilter = 'all';

  // DOM Elements
  const navConversationsBtn = document.getElementById('navConversationsBtn');
  const navContactsBtn = document.getElementById('navContactsBtn');
  const appLayout = document.getElementById('appLayout');
  const totalUnreadBadge = document.getElementById('totalUnreadBadge');
  const currentUserAvatar = document.getElementById('currentUserAvatar');
  const currentUserName = document.getElementById('currentUserName');
  const currentUserRole = document.getElementById('currentUserRole');

  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const listTitle = document.getElementById('listTitle');
  const listCount = document.getElementById('listCount');
  const conversationFilters = document.getElementById('conversationFilters');
  const allFilterBtn = document.getElementById('allFilterBtn');
  const unreadFilterBtn = document.getElementById('unreadFilterBtn');
  const unreadFilterCount = document.getElementById('unreadFilterCount');
  const newMessageBtn = document.getElementById('newMessageBtn');
  const emptyStartChatBtn = document.getElementById('emptyStartChatBtn');
  const inboxHeadingTitle = document.getElementById('inboxHeadingTitle');
  const listLoadingState = document.getElementById('listLoadingState');
  const listEmptyState = document.getElementById('listEmptyState');
  const itemsList = document.getElementById('itemsList');

  const chatPanel = document.getElementById('chatPanel');
  const mobileBackBtn = document.getElementById('mobileBackBtn');
  const activeAvatar = document.getElementById('activeAvatar');
  const activeContactName = document.getElementById('activeContactName');
  const activeContactStatus = document.getElementById('activeContactStatus');
  const emptyConversationState = document.getElementById('emptyConversationState');
  const messagesStream = document.getElementById('messagesStream');
  const chatMessages = document.getElementById('chatMessages');

  const feedbackBanner = document.getElementById('feedbackBanner');
  const feedbackText = document.getElementById('feedbackText');
  const feedbackCloseBtn = document.getElementById('feedbackCloseBtn');

  const composerForm = document.getElementById('composerForm');
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');

  // Relative API Resolver
  function apiUrl(endpoint) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const basePath = window.location.pathname.endsWith('/')
      ? window.location.pathname
      : window.location.pathname + '/';
    return `${basePath}api/${cleanEndpoint}`;
  }

  // Format Timestamps
  function formatTime(isoString) {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  }

  // Feedback display
  function showFeedback(message, isError = true) {
    feedbackText.textContent = message;
    feedbackBanner.style.backgroundColor = isError ? '#fef2f2' : '#f0fdf4';
    feedbackBanner.style.borderColor = isError ? '#fecaca' : '#bbf7d0';
    feedbackBanner.style.color = isError ? '#b91c1c' : '#15803d';
    feedbackBanner.style.display = 'flex';
  }

  function hideFeedback() {
    feedbackBanner.style.display = 'none';
  }

  feedbackCloseBtn.addEventListener('click', hideFeedback);

  // Initialize Application
  async function init() {
    setupEventListeners();
    await loadCurrentUser();
    await loadConversations();
    await loadContacts();
  }

  // Event Listeners
  function setupEventListeners() {
    navConversationsBtn.addEventListener('click', () => switchTab('conversations'));
    navContactsBtn.addEventListener('click', () => switchTab('contacts'));
    newMessageBtn.addEventListener('click', () => switchTab('contacts'));
    emptyStartChatBtn.addEventListener('click', () => switchTab('contacts'));
    allFilterBtn.addEventListener('click', () => setConversationFilter('all'));
    unreadFilterBtn.addEventListener('click', () => setConversationFilter('unread'));

    let searchDebounceTimeout = null;
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      if (query.trim().length > 0) {
        clearSearchBtn.style.display = 'block';
        clearTimeout(searchDebounceTimeout);
        searchDebounceTimeout = setTimeout(() => {
          performSearch(query);
        }, 200);
      } else {
        clearSearchBtn.style.display = 'none';
        if (currentTab === 'search') {
          switchTab('conversations');
        }
      }
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      if (currentTab === 'search') {
        switchTab('conversations');
      }
    });

    composerForm.addEventListener('submit', handleSendMessage);

    mobileBackBtn.addEventListener('click', () => {
      appLayout.classList.remove('conversation-open');
      chatPanel.classList.remove('active');
    });
  }

  // Current User
  async function loadCurrentUser() {
    try {
      const res = await fetch(apiUrl('contacts/me'));
      if (res.ok) {
        currentUser = await res.json();
        currentUserAvatar.textContent = currentUser.initials || 'ME';
        currentUserAvatar.style.backgroundColor = currentUser.avatarColor || '#4f46e5';
        currentUserName.textContent = currentUser.displayName || 'Demo User';
        currentUserRole.textContent = currentUser.role || 'Demo Account';
      }
    } catch (err) {
      console.warn('Failed to load user info:', err);
    }
  }

  // Switch Tab
  function switchTab(tab) {
    currentTab = tab;
    hideFeedback();
    appLayout.classList.remove('conversation-open');
    chatPanel.classList.remove('active');

    navConversationsBtn.classList.toggle('active', tab === 'conversations');
    navContactsBtn.classList.toggle('active', tab === 'contacts');
    conversationFilters.style.display = tab === 'conversations' ? 'flex' : 'none';
    inboxHeadingTitle.textContent = tab === 'contacts' ? 'Team contacts' : 'Messages';
    newMessageBtn.style.display = tab === 'contacts' ? 'none' : 'flex';

    if (tab === 'conversations') {
      listTitle.textContent = conversationFilter === 'unread' ? 'Unread conversations' : 'Recent conversations';
      renderConversationsList();
    } else if (tab === 'contacts') {
      listTitle.textContent = 'Team Contacts';
      renderContactsList();
    }
  }

  function setConversationFilter(filter) {
    conversationFilter = filter;
    allFilterBtn.classList.toggle('active', filter === 'all');
    unreadFilterBtn.classList.toggle('active', filter === 'unread');
    allFilterBtn.setAttribute('aria-pressed', String(filter === 'all'));
    unreadFilterBtn.setAttribute('aria-pressed', String(filter === 'unread'));
    listTitle.textContent = filter === 'unread' ? 'Unread conversations' : 'Recent conversations';
    renderConversationsList();
  }

  // Load Conversations
  async function loadConversations() {
    listLoadingState.style.display = 'flex';
    listEmptyState.style.display = 'none';

    try {
      const res = await fetch(apiUrl('conversations'));
      if (!res.ok) throw new Error('Failed to load conversations');
      conversations = await res.json();
      updateTotalUnreadBadge();

      if (currentTab === 'conversations') {
        renderConversationsList();
      }
    } catch (err) {
      showFeedback('Could not load conversations. Please retry.');
    } finally {
      listLoadingState.style.display = 'none';
    }
  }

  // Load Contacts
  async function loadContacts() {
    try {
      const res = await fetch(apiUrl('contacts'));
      if (!res.ok) throw new Error('Failed to load contacts');
      contacts = await res.json();
      if (currentTab === 'contacts') {
        renderContactsList();
      }
    } catch (err) {
      console.warn('Could not load contacts:', err);
    }
  }

  // Update Total Unread Badge
  function updateTotalUnreadBadge() {
    const total = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    unreadFilterCount.textContent = total;
    if (total > 0) {
      totalUnreadBadge.textContent = total;
      totalUnreadBadge.style.display = 'flex';
    } else {
      totalUnreadBadge.style.display = 'none';
    }
  }

  // Render Conversations List
  function renderConversationsList() {
    const visibleConversations = conversationFilter === 'unread'
      ? conversations.filter((conversation) => (conversation.unreadCount || 0) > 0)
      : conversations;
    listCount.textContent = visibleConversations.length;
    itemsList.innerHTML = '';

    if (visibleConversations.length === 0) {
      listEmptyState.querySelector('.empty-title').textContent = conversationFilter === 'unread' ? 'You’re all caught up' : 'No conversations yet';
      listEmptyState.querySelector('.empty-subtitle').textContent = conversationFilter === 'unread' ? 'New unread messages will appear here' : 'Start a conversation with someone on your team';
      listEmptyState.style.display = 'flex';
      return;
    }
    listEmptyState.style.display = 'none';

    visibleConversations.forEach((conv) => {
      const item = document.createElement('div');
      item.className = `list-item ${conv.id === activeConversationId ? 'active' : ''}`;
      item.dataset.id = conv.id;

      const contact = conv.contact || {};
      const statusClass = contact.status || 'offline';
      const previewText = conv.lastMessage ? conv.lastMessage.text : 'No messages yet';
      const timeStr = conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : formatTime(conv.createdAt);

      item.innerHTML = `
        <div class="avatar-wrapper">
          <div class="avatar" style="background-color: ${contact.avatarColor || '#4f46e5'};">
            ${contact.initials || '??'}
          </div>
          <span class="status-dot ${statusClass}"></span>
        </div>
        <div class="item-content">
          <div class="item-header">
            <span class="item-name">${contact.displayName || 'Unknown'}</span>
            <span class="item-time">${timeStr}</span>
          </div>
          <div class="item-bottom">
            <span class="item-preview">${previewText}</span>
            ${conv.unreadCount > 0 ? `<span class="unread-badge">${conv.unreadCount}</span>` : ''}
          </div>
        </div>
      `;

      item.addEventListener('click', () => openConversation(conv.id, contact));
      itemsList.appendChild(item);
    });
  }

  // Render Contacts List
  function renderContactsList() {
    listCount.textContent = contacts.length;
    itemsList.innerHTML = '';

    if (contacts.length === 0) {
      listEmptyState.style.display = 'flex';
      return;
    }
    listEmptyState.style.display = 'none';

    contacts.forEach((contact) => {
      const item = document.createElement('div');
      item.className = 'list-item';
      item.dataset.contactId = contact.id;

      const statusClass = contact.status || 'offline';

      item.innerHTML = `
        <div class="avatar-wrapper">
          <div class="avatar" style="background-color: ${contact.avatarColor || '#0ea5e9'};">
            ${contact.initials || '??'}
          </div>
          <span class="status-dot ${statusClass}"></span>
        </div>
        <div class="item-content">
          <div class="item-header">
            <span class="item-name">${contact.displayName}</span>
          </div>
          <div class="item-bottom">
            <span class="item-preview">${contact.role || 'Team Member'}</span>
          </div>
        </div>
      `;

      item.addEventListener('click', () => startOrOpenConversationWithContact(contact));
      itemsList.appendChild(item);
    });
  }

  // Search
  async function performSearch(query) {
    currentTab = 'search';
    appLayout.classList.remove('conversation-open');
    chatPanel.classList.remove('active');
    conversationFilters.style.display = 'none';
    inboxHeadingTitle.textContent = 'Search';
    newMessageBtn.style.display = 'none';
    navConversationsBtn.classList.remove('active');
    navContactsBtn.classList.remove('active');
    listTitle.textContent = `Search results for "${query}"`;

    listLoadingState.style.display = 'flex';
    listEmptyState.style.display = 'none';
    itemsList.innerHTML = '';

    try {
      const res = await fetch(apiUrl(`search?q=${encodeURIComponent(query)}`));
      if (!res.ok) throw new Error('Search request failed');
      const data = await res.json();
      searchResults = data;
      renderSearchResults(data, query);
    } catch (err) {
      showFeedback('Search error. Please try again.');
    } finally {
      listLoadingState.style.display = 'none';
    }
  }

  function renderSearchResults(data, query) {
    const totalResults = (data.contacts ? data.contacts.length : 0) + (data.messages ? data.messages.length : 0);
    listCount.textContent = totalResults;
    itemsList.innerHTML = '';

    if (totalResults === 0) {
      listEmptyState.style.display = 'flex';
      listEmptyState.querySelector('.empty-title').textContent = `No matches found`;
      listEmptyState.querySelector('.empty-subtitle').textContent = `Try searching with a different term`;
      return;
    }
    listEmptyState.style.display = 'none';

    // Matching Contacts Section
    if (data.contacts && data.contacts.length > 0) {
      const header = document.createElement('div');
      header.style.cssText = 'padding: 8px 16px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;';
      header.textContent = `Contacts (${data.contacts.length})`;
      itemsList.appendChild(header);

      data.contacts.forEach((contact) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
          <div class="avatar-wrapper">
            <div class="avatar" style="background-color: ${contact.avatarColor || '#4f46e5'};">
              ${contact.initials || '??'}
            </div>
            <span class="status-dot ${contact.status || 'offline'}"></span>
          </div>
          <div class="item-content">
            <div class="item-header">
              <span class="item-name">${contact.displayName}</span>
            </div>
            <div class="item-bottom">
              <span class="item-preview">${contact.role || 'Contact'}</span>
            </div>
          </div>
        `;
        item.addEventListener('click', () => startOrOpenConversationWithContact(contact));
        itemsList.appendChild(item);
      });
    }

    // Matching Messages Section
    if (data.messages && data.messages.length > 0) {
      const header = document.createElement('div');
      header.style.cssText = 'padding: 8px 16px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;';
      header.textContent = `Messages (${data.messages.length})`;
      itemsList.appendChild(header);

      data.messages.forEach((msg) => {
        const contact = msg.contact || { displayName: 'Conversation', avatarColor: '#4f46e5', initials: '??' };
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
          <div class="avatar-wrapper">
            <div class="avatar" style="background-color: ${contact.avatarColor || '#4f46e5'};">
              ${contact.initials || '??'}
            </div>
          </div>
          <div class="item-content">
            <div class="item-header">
              <span class="item-name">${contact.displayName}</span>
              <span class="item-time">${formatTime(msg.createdAt)}</span>
            </div>
            <div class="item-bottom">
              <span class="item-preview">${msg.text}</span>
            </div>
          </div>
        `;
        item.addEventListener('click', () => openConversation(msg.conversationId, contact));
        itemsList.appendChild(item);
      });
    }
  }

  // Open Conversation
  async function openConversation(convId, contactInfo) {
    activeConversationId = convId;
    activeContact = contactInfo;

    // Highlight in list
    document.querySelectorAll('.list-item').forEach((el) => {
      el.classList.toggle('active', el.dataset.id === convId);
    });

    // Update Chat Header
    activeAvatar.textContent = contactInfo.initials || '??';
    activeAvatar.style.backgroundColor = contactInfo.avatarColor || '#4f46e5';
    activeContactName.textContent = contactInfo.displayName || 'Conversation';
    activeContactStatus.innerHTML = `
      <span class="status-dot ${contactInfo.status || 'offline'}"></span>
      <span class="status-label">${contactInfo.status ? contactInfo.status.toUpperCase() : 'DEMO MODE'}</span>
    `;

    // Enable Composer
    messageInput.disabled = false;
    sendBtn.disabled = false;
    messageInput.placeholder = `Message ${contactInfo.displayName || ''}...`;
    messageInput.focus();

    // Mobile view switch
    appLayout.classList.add('conversation-open');
    chatPanel.classList.add('active');

    // Load Messages
    await loadMessagesForActiveConversation();

    // Mark as read
    try {
      await fetch(apiUrl(`conversations/${convId}/read`), { method: 'POST' });
      // Refresh conversation item to update unread badge
      await loadConversations();
    } catch (err) {
      console.warn('Could not mark as read:', err);
    }
  }

  // Start or open conversation with contact
  async function startOrOpenConversationWithContact(contact) {
    const existing = conversations.find((c) => c.contactId === contact.id);
    if (existing) {
      await openConversation(existing.id, contact);
      return;
    }

    try {
      const res = await fetch(apiUrl('conversations'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: contact.id })
      });
      if (!res.ok) throw new Error('Failed to create conversation');
      const newConv = await res.json();
      await loadConversations();
      await openConversation(newConv.id, contact);
    } catch (err) {
      showFeedback('Could not start conversation with contact.');
    }
  }

  // Load Messages for Active Conversation
  async function loadMessagesForActiveConversation() {
    if (!activeConversationId) return;

    try {
      const res = await fetch(apiUrl(`conversations/${activeConversationId}/messages`));
      if (!res.ok) throw new Error('Failed to load messages');
      const messages = await res.json();
      renderMessages(messages);
    } catch (err) {
      showFeedback('Could not load message history.');
    }
  }

  // Render Messages
  function renderMessages(messages) {
    emptyConversationState.style.display = 'none';
    messagesStream.style.display = 'flex';
    messagesStream.innerHTML = '';

    if (!messages || messages.length === 0) {
      messagesStream.innerHTML = `
        <div style="text-align: center; color: #94a3b8; font-size: 13px; margin: 40px auto;">
          No messages yet. Send a message below to start the conversation!
        </div>
      `;
      return;
    }

    messages.forEach((msg) => {
      const isOutgoing = currentUser ? msg.senderId === currentUser.id : msg.senderId === 'user-alex';
      const wrapper = document.createElement('div');
      wrapper.className = `message-bubble-wrapper ${isOutgoing ? 'outgoing' : 'incoming'}`;
      wrapper.innerHTML = `
        <div class="message-bubble">${escapeHtml(msg.text)}</div>
        <div class="message-meta">${formatTime(msg.createdAt)}</div>
      `;
      messagesStream.appendChild(wrapper);
    });

    // Auto-scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Handle Send Message
  async function handleSendMessage(e) {
    e.preventDefault();
    if (isSending || !activeConversationId) return;

    const rawText = messageInput.value;
    const text = rawText.trim();
    if (!text) {
      showFeedback('Cannot send an empty message.');
      return;
    }

    hideFeedback();
    isSending = true;
    messageInput.disabled = true;
    sendBtn.disabled = true;

    try {
      const res = await fetch(apiUrl(`conversations/${activeConversationId}/messages`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error ? errorData.error.message : 'Failed to send message');
      }

      // Success: clear input only after successful submission
      messageInput.value = '';

      // Reload messages for the active conversation
      await loadMessagesForActiveConversation();

      // Refresh conversations list to update preview and timestamp
      await loadConversations();
    } catch (err) {
      showFeedback(err.message || 'Error sending message. Draft preserved.');
    } finally {
      isSending = false;
      messageInput.disabled = false;
      sendBtn.disabled = false;
      messageInput.focus();
    }
  }

  // Helper
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
