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
```
---

### 3. Install Dependencies
```bash
npm install
```

---

### 4. Configure Enviroment Variables

Firebase Secrets are used to securely store sensitive information, such as the OpenAl API key.

1. Set your OpenAl API key as a secret in Firebase:
   ```bash
   firebase functions:secrets:set OPENAI_API_KEY
   ```
2. Verify that the secret has been added:
   ```bash
   firebase functions:secrets:access OPENAI_API_KEY
   ```
3. The function will automatically retrieve the OPENAI_API_KEY when executed.

---

### 5. Deploy the Firebase Functions

a. Initialize Firebase
```bash
firebase init functions
```
• Choose your Firebase project from the list.
• Select JavaScript as the language for Firebase Functions.

b. Deploy the Functions
```bash
firebase deploy --only functions
```
---

### 6. Test the API

You can test the addpost respondmessage function using a tool like Postman or curl.

For Example (Replace your-firebase-cloud-functions-url with the actual URL of your deployed Firebase Function):
```bash
curl -X GET "https://your-firebase-cloud-functions-url/addpostrespondmessage?text=Hello&pid=participant123"

```
