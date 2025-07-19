import { Box, Heading, Text, Button, Stack, Container } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      bg="gray.50"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <Container maxW="container.md">
        <Heading as="h1" size="2xl" mb={4}>
          Selamat Datang di Debt Tracker App
        </Heading>
        <Text fontSize="xl" mb={8} color="gray.600">
          Kelola utang dan piutang Anda dengan mudah dan terorganisir.
        </Text>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justifyContent="center"
        >
          <Button
            colorScheme="teal"
            size="lg"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/register")}
          >
            Daftar
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default LandingPage;
