import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Center, Spinner, Box } from "@chakra-ui/react";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // Menunggu status otentikasi dimuat dari localStorage
  if (user === undefined) {
    return (
      <Center height="100vh">
        <Box textAlign="center">
          <Spinner size="xl" mb={4} />
          <p>Loading...</p>
        </Box>
      </Center>
    );
  }

  // Jika tidak ada user, redirect ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada user, tampilkan halaman yang diminta
  return children;
};

export default ProtectedRoute;
