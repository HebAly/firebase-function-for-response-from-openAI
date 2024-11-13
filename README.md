# Firebase Function for Response from OpenAI

This repository contains backend Firebase functions to enable an AI assistant powered by OpenAI GPT. The functions handle message storage and generate AI responses for participants.

---

## Features
- **Store User Messages**: Saves participant messages in Firebase Realtime Database.
- **Generate AI Responses**: Uses OpenAI's API to generate AI responses.
- **Enforce Message Limits**: Restricts the number of messages per participant.
- **Secure Sensitive Data**: Leverages environment variables to protect private information.

---

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed on your system.
- A Firebase project configured with Realtime Database.
- An OpenAI API key.

---

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/firebase-function-for-response-from-openAI.git
cd firebase-function-for-response-from-openAI
