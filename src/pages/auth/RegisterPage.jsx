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
import { registerUser } from "../../api/authApi";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await registerUser(name, email, password);

    if (result.success) {
      toast({
        title: "Registrasi Berhasil",
        description: "Akun Anda telah dibuat. Silakan masuk.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    } else {
      toast({
        title: "Registrasi Gagal",
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
        Daftar Akun Baru
      </Heading>
      <form onSubmit={handleRegister}>
        <Stack spacing={4}>
          <FormControl id="name">
            <FormLabel>Nama Lengkap</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormControl>
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
            loadingText="Mendaftar..."
            mt={4}
          >
            Daftar
          </Button>
        </Stack>
      </form>
      <Text mt={6} textAlign="center">
        Sudah punya akun?{" "}
        <Link as={RouterLink} to="/login" color="teal.500">
          Masuk di sini
        </Link>
      </Text>
    </Box>
  );
};

export default RegisterPage;
