# firebase-function-for-response-from-openAI

This repository contains backend Firebase functions to enable an AI assistant powered by OpenAI GPT. The functions handle message storage and generate AI responses for participants.

# Features
- Store user messages in Firebase Realtime Database.
- Generate AI responses using OpenAI's API.
- Enforce a message limit per participant.
- Secure sensitive data using environment variables.

# Setup Instructions
1. Prerequisites
Node.js installed on your system.
Firebase project configured with Realtime Database.
OpenAI API key.
2. Clone the Repository
bash
Copy code
git clone https://github.com/your-username/firebase-ai-assistant.git
cd firebase-ai-assistant
3. Install Dependencies
bash
Copy code
npm install
4. Configure Environment Variables
Create a .env file in the root directory.
Add the following variables:
plaintext
Copy code
OPENAI_API_KEY=your_openai_api_key
5. Deploy the Firebase Functions
Initialize Firebase

bash
Copy code
firebase init functions
Choose the appropriate Firebase project.
Select TypeScript as the language.
Deploy the Functions

bash
Copy code
firebase deploy --only functions
6. Test the API
Use a tool like Postman or curl to test the addpostrespondmessage function:

bash
Copy code
curl -X GET "https://your-firebase-cloud-functions-url/addpostrespondmessage?text=Hello&pid=participant123"
Function Details
1. addpostrespondmessage
Handles message storage and request limit enforcement.

Endpoint: /addpostrespondmessage
Method: GET
Query Parameters:
text: Message text.
pid: Participant ID.
2. getAIResponse
Triggered when a new message is added to the database. Sends a conversation history to OpenAI and stores the response.

Contributing
Feel free to submit issues or contribute to the project via pull requests.

