import { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Text,
  Link,
  useToast,
} from "@chakra-ui/react";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/authApi";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await loginUser(email, password);

    if (result.success) {
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      login(result.user);
      navigate("/dashboard");
    } else {
      toast({
        title: "Login Gagal",
        description: result.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
    >
      <Heading as="h2" size="xl" textAlign="center" mb={6}>
        Masuk ke Akun Anda
      </Heading>
      <form onSubmit={handleLogin}>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Alamat Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            isLoading={isLoading}
            loadingText="Memproses..."
            mt={4}
          >
            Masuk
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginPage;
