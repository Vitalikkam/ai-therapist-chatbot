import React from 'react'
import { VStack, HStack, Box, Text, Image, Input, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { register_user } from '../api/endpoints';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleRegister = () => {
    try {
      fetchRegister();
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const fetchRegister = async () => {
        if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
        } else {
            try {
              const data = await register_user(username, password, email);
              console.log("Registration successful:", data);
              navigate("/login");
            } catch (error) {
              console.error("Registration failed:", error);
              alert("Registration failed. Please check your credentials and try again.");
            }
        }
  };
  return (
    <>
        <VStack
            spacing={4}
            align="stretch"
            position="relative"
            height="100vh"
            w="100%"
            bgImage="url('/background.jpg')"
            bgSize="cover"
        >
            <Text fontSize="3xl" fontWeight="bold" textAlign="center" p={4} borderBottom="2px" borderColor="gray.200" boxShadow="md" bg="#D5F3D8">Register</Text>
            <HStack flex="1" overflowY="auto" p={4} justify="center" align="center">
              <Box
                position="absolute"
                right="40px"
                bottom="50%"
                textAlign="center"
                boxSize="280px"
              >

            </Box>
            <VStack spacing={4} align="center">
                <Text fontSize="2xl" fontWeight="bold"mb='12px'>Welcome Back to a Healthy Life!</Text>
                <Text onClick={() => navigate("/login")} fontSize="lg" fontWeight="bold" color='black' pt='20px' cursor="pointer">Do you have an account? Login</Text>
                <Input onChange={(e) => setUsername(e.target.value)} placeholder="Username" size="md" width="300px" bgColor="#F2C7C7" borderColor="#F2C7C7" />
                <Input onChange={(e) => setEmail(e.target.value)} placeholder="Email" size="md" width="300px" bgColor="#F2C7C7" borderColor="#F2C7C7" />
                <Input onChange={(e) => setPassword(e.target.value)} placeholder="Password" size="md" width="300px" type="password" bgColor="#F2C7C7" borderColor="#F2C7C7" />
                <Input onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" size="md" width="300px" type="password" bgColor="#F2C7C7" borderColor="#F2C7C7" />
                <Button  onClick={handleRegister} colorScheme="teal" size="md" width="100px" bgColor="#F2C" borderColor="#F2C7C7">Register</Button>
            </VStack>
            </HStack>
    
        </VStack>
    </>
  )
}

export default Register