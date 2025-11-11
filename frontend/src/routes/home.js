import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Image,
  Box,
} from "@chakra-ui/react";
import { send_chat_message as apiSendChatMessage } from "../api/endpoints.js";
import { logout_user } from "../api/endpoints.js";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cuteVoice, setCuteVoice] = useState(null);
  const [username, setUsername] = useState("");

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Load auth state and username from localStorage once
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  // ✅ Preload voices
  useEffect(() => {
    const loadVoices = () => {
      const synth = window.speechSynthesis;
      let voices = synth.getVoices();
      if (voices.length > 0) {
        const voice =
          voices.find(
            (v) =>
              v.lang.includes("en") &&
              (v.name.toLowerCase().includes("female") ||
                v.name.toLowerCase().includes("samantha") ||
                v.name.toLowerCase().includes("google"))
          ) || voices[0];
        setCuteVoice(voice);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // ✅ Send message
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      setIsTyping(true);
      setDisplayedText("");
      setReply("");

      const data = await apiSendChatMessage(message);
      setReply(data?.reply || "Sorry, I didn’t receive a proper response.");
    } catch (error) {
      console.error("Error:", error);
      setReply("Sorry, I couldn’t connect to the server.");
    } finally {
      setMessage("");
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await logout_user();
      setIsAuthenticated(false);
      setUsername("");
      localStorage.removeItem("username");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ✅ Typewriter + voice effect
  useEffect(() => {
    if (!reply || !cuteVoice) return;
    setIsTyping(true);
    setDisplayedText("");

    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.voice = cuteVoice;
    utterance.pitch = 1.3;
    utterance.rate = 1.0;
    utterance.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    let i = 0;
    const interval = setInterval(() => {
      if (i < reply.length) {
        setDisplayedText((prev) => prev + reply.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [reply, cuteVoice]);

  return (
    <VStack
      spacing={4}
      align="stretch"
      position="relative"
      height="100vh"
      w="100%"
      bgImage="url('/background.jpg')"
      bgSize="cover"
    >
      <Text
        fontSize="4xl"
        fontWeight="bold"
        textAlign="center"
        p={4}
        borderBottom="2px"
        borderColor="gray.200"
        boxShadow="md"
        bg="#D5F3D8"
      >
        AI Therapist Chatbot
      </Text>

      {/* Chat area */}
      <HStack flex="1" overflowY="auto" p={4} justify="center" align="center">
        <Box
          textAlign="center"
          bg="#F7F9F7"
          p={6}
          borderRadius="2xl"
          boxShadow="lg"
          maxW="60%"
          minH="100px"
        >
          <Text
            fontSize="lg"
            color="gray.800"
            whiteSpace="pre-wrap"
            style={{
              borderRight: isTyping ? "2px solid #4CAF50" : "none",
              animation: isTyping ? "blink 0.8s steps(2, start) infinite" : "",
            }}
          >
            {displayedText}
          </Text>
        </Box>

        <Box
          position="absolute"
          right="40px"
          bottom="50%"
          textAlign="center"
          boxSize="280px"
        >
          <Image
            src="../therapist.jpg"
            alt="Therapist"
            boxSize="380px"
            borderRadius="full"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
            border="3px solid #D5F3D8"
            objectFit="cover"
          />
          <Text fontSize="lg" color="gray.700" mt="2" fontWeight="bold">
            Your AI Therapist
          </Text>
        </Box>
      </HStack>

      {/* Input & Auth Buttons */}
      <HStack
        h="9%"
        position="absolute"
        bottom="0"
        gap="2"
        align="center"
        w="100%"
        border="1px"
        borderColor="gray.200"
        bg="#D5F3D8"
        p={4}
        boxShadow="md"
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          bg="#F2C7C7"
          height="100%"
          w="30%"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button
          onClick={handleSendMessage}
          color="black"
          bg="#F2C7C7"
          w="5%"
          isDisabled={isTyping}
        >
          {isTyping ? "..." : "Send"}
        </Button>

        {!isAuthenticated ? (
          <>
            <Button onClick={() => navigate("/login")} color="black" bg="#F2C7C7" left='50%' w="10%">
              Login
            </Button>
            <Button onClick={() => navigate("/register")} color="black" bg="#F2C7C7" left='25%' w="10%">
              Signup
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleLogout} color="black" bg="#F2C7C7" left='50%' w="10%">
              Logout
            </Button>
            <Text fontWeight="bold" fontSize="lg" color="black" right='25%' w="10%">{username}</Text>
          </>
        )}
      </HStack>

      <style>
        {`
          @keyframes blink {
            50% { border-color: transparent; }
          }
        `}
      </style>
    </VStack>
  );
}

export default Home;