# PingSpace Lite — Team Messaging Application

## 1. Your Mission: Investigate & Fix the Bugs

You are a **Full-Stack Developer** working on PingSpace Lite, a team messaging application designed to help individuals and teams communicate through direct conversations. The QA team has identified four critical issues affecting everyday messaging operations.

Your responsibility is to investigate the existing codebase, reproduce each issue, identify its root cause, and implement reliable fixes without disrupting existing functionality.

### BUG-01: Messages Displayed in Reverse Order
**Problem:** Messages appear upside down, with the newest messages displayed at the top and older messages at the bottom.

**How to identify it:** Open any conversation in the Live Preview and inspect the message history. Observe the order in which messages are displayed.

**Your task:** Ensure messages appear chronologically, with older messages at the top and the newest messages at the bottom.

### BUG-02: Incorrect Unread Message Counts
**Problem:** Messages sent by the current user are incorrectly contributing to unread notification badges.

**How to identify it:** Open a conversation, send a message, and observe the unread indicators in the conversation list. Check whether your own outgoing messages are being counted as unread.

**Your task:** Ensure unread counts include only incoming, unread messages received from other users.

### BUG-03: Case-Sensitive Message Search
**Problem:** Searching for a message using lowercase letters fails to return results when the original message contains uppercase characters.

**How to identify it:** Open the search bar and search for a word that appears with different capitalization in an existing conversation.

**Your task:** Make message search case-insensitive so that matching results are returned regardless of capitalization.

### BUG-04: Incorrect Conversation Switching
**Problem:** Selecting another contact sometimes continues displaying the previous contact's message history instead of loading the selected conversation.

**How to identify it:** Open one conversation, note its messages, and then select a different contact from the conversation list. Observe whether the message history updates correctly.

**Your task:** Ensure every conversation selection loads only the messages associated with that specific contact.

---

## 2. Get Familiar With the Application

PingSpace Lite is a lightweight team communication platform that provides a unified interface for managing contacts and direct conversations.

**Core Features:**

- **Team Contacts:** Browse colleagues, their profiles, roles, and availability.
- **Direct Messaging:** Exchange messages through dedicated one-on-one conversations.
- **Message History:** View messages with timestamps and clear sender identification.
- **Unread Notifications:** Track unread incoming messages through conversation badges.
- **Unified Search:** Search for contacts and messages from a single search interface.
- **Responsive Interface:** Navigate between contacts and conversations across desktop and mobile screens.




<img width="959" height="413" alt="Screenshot 2026-11-01 023824" src="https://github.com/user-attachments/assets/57bc4a7c-7655-4c4c-b872-b284687472c8" />


<img width="667" height="414" alt="image" src="https://github.com/user-attachments/assets/c6d94d27-ba50-409b-b872-90602106adee" />


<img width="959" height="413" alt="image" src="https://github.com/user-attachments/assets/a0aa0a71-a6f3-4634-9d67-46d0fa4a96bb" />

---

## 3. Expected Behaviour After Fixing the Bugs

Once all reported issues have been resolved, the application should behave as follows:

1. **Message Ordering:** Messages appear chronologically, with the newest message at the bottom.
2. **Unread Counts:** Only incoming unread messages contribute to notification badges. Opening a conversation should clear its unread count according to the application's existing read-state behaviour.
3. **Message Search:** Search returns matching messages regardless of uppercase or lowercase characters.
4. **Conversation Switching:** Selecting a contact loads the correct conversation without displaying messages from previously selected contacts.

All existing messaging functionality must continue working as expected.

---

## 4. Integrated Terminal Commands

Your workspace provides an integrated terminal to execute the following commands:

**Start the Development Server**
```bash
npm run dev
```
Starts the PingSpace Lite application locally so you can interact with it through the Live Preview.

**Run Automated Tests**
```bash
npm test
```
Executes the available automated test suite to verify your implementation and identify unresolved issues.

Use the Live Preview alongside the terminal to observe application behaviour and verify your changes.

---

## 5. Workspace Guidelines & Submission

You have access to the complete application codebase, an interactive Live Preview, an integrated terminal, and an AI-powered coding assistant.

**Available Workspace Tools:**

- **Code Editor:** Explore and modify the existing source code.
- **Live Preview:** Interact with the application and reproduce the four reported bugs.
- **Integrated Terminal:** Start the development server and execute automated tests.
- **AI Assistant:** Ask for explanations, debugging guidance, and help understanding unfamiliar code.

**Hard Reset Policy:**

The workspace includes a Hard Reset option that restores the challenge to its original state.

- Maximum of **2 Hard Reset activations**.
- A minimum cooldown of **10 minutes** between consecutive activations.
- Resetting discards your current code changes and restores the original challenge files.

Use Hard Reset carefully, as your progress will be lost.

**Before Submission:**

- Resolve all four reported bugs.
- Verify the fixes through the Live Preview.
- Run the automated tests.
- Ensure existing application functionality remains intact.

Once satisfied, submit your implementation through DEBUG//LAB.

Your solution will be evaluated using automated test cases, including hidden test cases that verify the correctness of your implementation.
