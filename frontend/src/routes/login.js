import React, { useContext, useState } from 'react';
import { VStack, HStack, Text, Input, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { login_user } from '../api/endpoints';
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await login_user(username, password);
      console.log("Login successful:", data);
      setIsAuthenticated(true);
      localStorage.setItem("username", username);
      navigate("/");
    } catch {
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <VStack spacing={4} align="stretch" height="100vh" w="100%" bgImage="url('/background.jpg')" bgSize="cover">
      <Text fontSize="3xl" fontWeight="bold" textAlign="center" p={4} borderBottom="2px" borderColor="gray.200" boxShadow="md" bg="#D5F3D8">Login</Text>
      <HStack flex="1" overflowY="auto" p={4} justify="center" align="center">
        <VStack spacing={4} align="center">
          <Text fontSize="2xl" fontWeight="bold" mb="12px">Welcome Back!</Text>
          <Text onClick={() => navigate("/register")} fontSize="lg" fontWeight="bold" color="black" cursor="pointer">Don't have an account? Sign up</Text>
          <Input onChange={(e) => setUsername(e.target.value)} placeholder="Username" size="md" width="300px" bgColor="#F2C7C7" />
          <Input onChange={(e) => setPassword(e.target.value)} placeholder="Password" size="md" width="300px" type="password" bgColor="#F2C7C7" />
          <Button onClick={handleLogin} colorScheme="teal" size="md" width="100px" bgColor="#F2C">Login</Button>
        </VStack>
      </HStack>
    </VStack>
  );
}

export default Login;