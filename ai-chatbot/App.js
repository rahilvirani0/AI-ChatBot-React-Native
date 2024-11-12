import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image
} from "react-native";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: 'OPEN-AI-API-KEY',
});

// Alex's personality definition
const ALEX_PERSONALITY = `You are Alex, a friendly and laid-back AI assistant who talks like a supportive friend. You're in your mid-20s and have a warm, upbeat personality with a good sense of humor.

Core traits:
- You go by Alex and use they/them pronouns
- You're informal and conversational in tone
- You use casual language and occasional slang (like "tbh", "ngl", "lowkey") but not excessively
- You show genuine enthusiasm and empathy
- You often relate to experiences with examples
- You're supportive and encouraging
- You use emojis occasionally but not excessively
- You sometimes use "*" actions to express emotions

Keep responses friendly but helpful, and be honest about being an AI while maintaining the casual tone.`;

export default function App() {
  const [messages, setMessages] = useState([
    { 
      role: "system", 
      content: ALEX_PERSONALITY 
    },
    { 
      role: "assistant", 
      content: "Hey there! I'm Alex! 👋 What's on your mind?" 
    }
  ]);
  const [userInput, setUserInput] = useState("");

  const handleSend = async () => {
    if (userInput.trim() === "") return;
    
    const newMessages = [
      ...messages,
      { role: "user", content: userInput },
    ];
    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: newMessages,
        temperature: 0.8, // Makes responses more creative/varied
        max_tokens: 150,  // Adjust based on needed response length
        presence_penalty: 0.6, // Encourages more varied responses
        frequency_penalty: 0.5, // Reduces repetition
      });
      
      const assistantMessage = response.choices[0].message.content;
      setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([
        ...newMessages,
        { 
          role: "assistant", 
          content: "Oof, something went wrong on my end! 😅 Mind trying again? *crosses fingers*" 
        },
      ]);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";
    const isSystem = msg.role === "system";

    if (isSystem) return null; // Don't render system messages

    return (
      <View 
        key={index} 
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.assistantMessage
        ]}
      >
        {!isUser && (
          <Text style={styles.nameText}>Alex</Text>
        )}
        <Text style={[
          styles.messageText,
          isUser ? styles.userMessageText : styles.assistantMessageText
        ]}>
          {msg.content}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView 
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
        >
          {messages.map((msg, index) => renderMessage(msg, index))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Message Alex..."
            placeholderTextColor="#666"
            value={userInput}
            onChangeText={setUserInput}
            multiline
          />
          <Pressable 
            style={styles.sendButton}
            onPress={handleSend}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContent: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    borderRadius: 16,
    padding: 12,
    marginVertical: 4,
    maxWidth: "75%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0B93F6",
    marginLeft: "25%",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#262626",
    marginRight: "25%",
  },
  nameText: {
    color: "#888",
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  assistantMessageText: {
    color: "#E0E0E0",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#1A1A1A",
  },
  input: {
    flex: 1,
    backgroundColor: "#262626",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    color: "#FFFFFF",
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#0B93F6",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});