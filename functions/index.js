const { onRequest } = require("firebase-functions/v2/https");
const { onValueCreated } = require("firebase-functions/v2/database");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors");

admin.initializeApp();

// CORS configuration for specific origin
const corsMiddleware = cors({ origin: "https://dissertation-back.web.app" });

// HTTP function to add a message
exports.addpostrespondmessage = onRequest({ secrets: ["OPENAI_API_KEY"] }, (req, resp) => {
  corsMiddleware(req, resp, async () => {
    try {
      const original = req.query.text;
      const pid = req.query.pid;

      if (!pid || !original) {
        return resp.status(400).json({ error: "Participant ID (pid) and text are required." });
      }

      const openaiApiKey = process.env.OPENAI_API_KEY; // Fetch the secret here
      if (!openaiApiKey) {
        logger.error("OpenAI API Key is missing.");
        return resp.status(500).json({ error: "OpenAI API Key is missing." });
      }

      const participantRef = admin.database().ref(`/participants/${pid}`);
      const requestCountSnapshot = await participantRef.child("requestCount").get();
      const requestCount = requestCountSnapshot.exists() ? requestCountSnapshot.val() : 0;

      if (requestCount >= 10) {
        if (requestCount === 10) {
          await participantRef.child("limitMessage").set("You have reached the maximum number of messages in this study.");
        }
        return resp.status(200).json({ message: "Limit reached." });
      }

      // Increment request count and store message and OpenAI key
      await participantRef.child("requestCount").transaction((count) => (count || 0) + 1);
      await participantRef.child(`messages/${requestCount + 1}`).set({
        original: original,
        openaiApiKey: openaiApiKey, // Store the API key here for use in onValueCreated
      });

      resp.status(200).json({ message: "Message received and stored successfully" });
    } catch (error) {
      logger.error("Error in addpostrespondmessage function:", error);
      resp.status(500).json({ error: "Internal Server Error" });
    }
  });
});

// Function to listen for new messages and respond
exports.getAIResponse = onValueCreated("/participants/{pid}/messages/{requestCount}/original", async (event) => {
  const original = event.data.val();
  const pid = event.params.pid;
  const requestCount = event.params.requestCount;

  const participantRef = admin.database().ref(`/participants/${pid}`);
  const messageRef = await participantRef.child(`messages/${requestCount}`).get();
  const messageData = messageRef.exists() ? messageRef.val() : null;

  if (!messageData || !messageData.openaiApiKey) {
    logger.error(`Missing OpenAI API Key for PID: ${pid}, Request Count: ${requestCount}.`);
    return;
  }

  const openaiApiKey = messageData.openaiApiKey; // Retrieve the key from the database

  try {
    const messagesSnapshot = await participantRef.child("messages").get();
    const conversationHistory = [
      {
        role: "system",
        content: "You are an AI assistant that helps users with privacy, security, and online education questions. Limit responses to 150 characters.",
      },
    ];

    messagesSnapshot.forEach((snapshot) => {
      const messageData = snapshot.val();
      if (messageData.original) {
        conversationHistory.push({ role: "user", content: messageData.original });
      }
      if (messageData.response) {
        conversationHistory.push({ role: "assistant", content: messageData.response });
      }
    });

    conversationHistory.push({ role: "user", content: original });

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo",
        messages: conversationHistory,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`, // Use the key from the database
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    await event.data.ref.parent.child("response").set(aiResponse);
    logger.log(`AI response for PID: ${pid}, Request Count: ${requestCount} saved successfully.`);
     // Update the openaiApiKey to "xxxxxxx" after saving the response
     await event.data.ref.parent.child("openaiApiKey").set("xxxxxxx");
  } catch (error) {
    logger.error("Error generating response from OpenAI:", error);
  }
});
