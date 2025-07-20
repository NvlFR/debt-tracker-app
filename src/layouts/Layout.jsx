// src/layouts/Layout.jsx
import {
  Box,
  Flex,
  useDisclosure,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { Menu, X } from "lucide-react"; // Import ikon dari lucide-react
import Navbar from "../components/layout/Navbar";

const Layout = ({ children }) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const sidebarBg = useColorModeValue("gray.800", "gray.900");
  const mainContentBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Flex minH="100vh" bg={mainContentBg}>
      {/* Sidebar Container */}
      <Flex
        as="nav"
        w={isOpen ? "250px" : "60px"}
        bg={sidebarBg}
        color="white"
        position="fixed"
        h="100vh"
        boxShadow="md"
        overflowX="hidden"
        direction="column"
        transition="width 0.25s ease"
        p={4}
      >
        {/* Tombol Toggle Sidebar */}
        <IconButton
          onClick={onToggle}
          icon={!isOpen ? <Menu size={24} /> : <X size={24} />} // Gunakan ikon Menu dan X
          variant="ghost"
          color="white"
          _hover={{ bg: "gray.700" }}
          aria-label="Toggle navigation"
          mb={4}
          alignSelf={isOpen ? "flex-end" : "center"}
          transition="all 0.25s ease"
        />

        <Navbar isOpen={isOpen} />
      </Flex>

      {/* Konten Halaman Utama */}
      <Box
        flex="1"
        ml={isOpen ? "250px" : "60px"}
        p={8}
        transition="margin-left 0.25s ease"
      >
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
