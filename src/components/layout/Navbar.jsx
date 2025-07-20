// src/components/layout/Navbar.jsx
import {
  Box,
  Heading,
  Button,
  VStack,
  useColorMode,
  IconButton,
  Link as ChakraLink,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react";
import {
  Moon,
  Sun,
  LayoutDashboard,
  Notebook,
  Wallet,
  Users,
  Folder,
  History,
  LogOut,
} from "lucide-react";
// Import NavLink dari react-router-dom
import { NavLink as ReactRouterNavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Definisikan item navigasi dengan ikon yang sesuai
const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/utang", label: "Utang", icon: Notebook },
  { path: "/piutang", label: "Piutang", icon: Wallet },
  { path: "/contacts", label: "Pihak Terkait", icon: Users },
  { path: "/categories", label: "Kategori", icon: Folder },
  { path: "/payment-history", label: "Riwayat Pembayaran", icon: History },
];

const Navbar = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    logout();
    navigate("/login");
  };

  return (
    <VStack spacing={4} align="stretch" flex="1">
      {isOpen && (
        <Heading as="h1" size="md" mb={4}>
          <ChakraLink
            as={ReactRouterNavLink} // Gunakan NavLink
            to="/dashboard"
            _hover={{ textDecoration: "none" }}
          >
            Debt Tracker App
          </ChakraLink>
        </Heading>
      )}

      <VStack spacing={2} align="stretch">
        {user ? (
          <>
            {navItems.map((item) => (
              <Box key={item.path}>
                <ChakraLink
                  as={ReactRouterNavLink} // Gunakan NavLink
                  to={item.path}
                  _hover={{ textDecoration: "none" }}
                >
                  {({ isActive }) => (
                    <HStack
                      spacing={4}
                      p={2}
                      rounded="md"
                      // Terapkan gaya hover dan aktif
                      bg={isActive ? "gray.700" : "transparent"}
                      _hover={{ bg: "gray.700" }}
                      transition="background-color 0.2s ease"
                    >
                      <Box as={item.icon} size={20} />
                      {isOpen && <Text>{item.label}</Text>}
                    </HStack>
                  )}
                </ChakraLink>
              </Box>
            ))}

            <Spacer />

            <Button
              onClick={handleLogout}
              colorScheme="red"
              mt={4}
              justifyContent={isOpen ? "start" : "center"}
            >
              <HStack>
                <Box as={LogOut} size={20} />
                {isOpen && <Text>Logout</Text>}
              </HStack>
            </Button>

            <IconButton
              onClick={toggleColorMode}
              icon={
                colorMode === "light" ? <Moon size={20} /> : <Sun size={20} />
              }
              variant="ghost"
              color="white"
              _hover={{ bg: "gray.700" }}
              aria-label="Toggle color mode"
            />
          </>
        ) : (
          <Button as={ReactRouterNavLink} to="/login" variant="ghost">
            Login
          </Button>
        )}
      </VStack>
    </VStack>
  );
};

export default Navbar;
