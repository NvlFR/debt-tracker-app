// src/components/layout/Navbar.jsx
import {
  Box,
  Heading,
  Button,
  VStack,
  useColorMode,
  IconButton,
  Link as ChakraLink,
  HStack, // Tambahkan HStack di sini
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
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
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
    navigate("/login");
  };

  return (
    <VStack spacing={4} align="stretch" flex="1">
      {/* Judul Aplikasi - Tampilkan hanya jika sidebar terbuka */}
      {isOpen && (
        <Heading as="h1" size="md" mb={4}>
          <ChakraLink
            as={ReactRouterLink}
            to="/dashboard"
            _hover={{ textDecoration: "none" }}
          >
            Debt Tracker App
          </ChakraLink>
        </Heading>
      )}

      {/* Navigasi Utama - VStack ini selalu ditampilkan */}
      <VStack spacing={2} align="stretch">
        {user ? (
          <>
            {navItems.map((item) => (
              <ChakraLink
                key={item.path}
                as={ReactRouterLink}
                to={item.path}
                p={2}
                rounded="md"
                _hover={{ bg: "gray.700" }}
              >
                <HStack spacing={4}>
                  <Box as={item.icon} size={20} />
                  {/* Teks label hanya ditampilkan jika sidebar terbuka */}
                  {isOpen && <Text>{item.label}</Text>}
                </HStack>
              </ChakraLink>
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
                {/* Teks label hanya ditampilkan jika sidebar terbuka */}
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
          <Button as={ReactRouterLink} to="/login" variant="ghost">
            Login
          </Button>
        )}
      </VStack>
    </VStack>
  );
};

export default Navbar;
