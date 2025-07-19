import {
  Box,
  Flex,
  Spacer,
  Heading,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box bg="teal.500" p={4} color="white">
      <Flex alignItems="center">
        <Heading as="h1" size="md">
          <RouterLink to="/dashboard">Debt Tracker App</RouterLink>
        </Heading>
        <Spacer />
        {user ? (
          <>
            <Box display={{ base: "none", md: "flex" }}>
              <Button as={RouterLink} to="/dashboard" variant="ghost" mx={2}>
                Dashboard
              </Button>
              <Button as={RouterLink} to="/utang" variant="ghost" mx={2}>
                Utang
              </Button>
              <Button as={RouterLink} to="/piutang" variant="ghost" mx={2}>
                Piutang
              </Button>
              <Button as={RouterLink} to="/contacts" variant="ghost" mx={2}>
                Pihak Terkait
              </Button>
              <Button as={RouterLink} to="/categories" variant="ghost" mx={2}>
                Kategori
              </Button>
              <Button onClick={handleLogout} variant="ghost" mx={2}>
                Logout
              </Button>
              <IconButton
                onClick={toggleColorMode}
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                variant="ghost"
              />
            </Box>
            <Box display={{ base: "block", md: "none" }}>
              <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                <MenuButton
                  as={IconButton}
                  icon={<HamburgerIcon />}
                  variant="ghost"
                />
                <MenuList bg="teal.500">
                  <MenuItem
                    as={RouterLink}
                    to="/dashboard"
                    onClick={onClose}
                    bg="teal.500"
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem
                    as={RouterLink}
                    to="/utang"
                    onClick={onClose}
                    bg="teal.500"
                  >
                    Utang
                  </MenuItem>
                  <MenuItem
                    as={RouterLink}
                    to="/piutang"
                    onClick={onClose}
                    bg="teal.500"
                  >
                    Piutang
                  </MenuItem>
                  <MenuItem
                    as={RouterLink}
                    to="/contacts"
                    onClick={onClose}
                    bg="teal.500"
                  >
                    Pihak Terkait
                  </MenuItem>
                  <MenuItem
                    as={RouterLink}
                    to="/categories"
                    onClick={onClose}
                    bg="teal.500"
                  >
                    Kategori
                  </MenuItem>
                  <MenuItem onClick={handleLogout} bg="teal.500">
                    Logout
                  </MenuItem>
                  <MenuItem onClick={toggleColorMode} bg="teal.500">
                    {colorMode === "light" ? "Dark Mode" : "Light Mode"}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </>
        ) : (
          <Button as={RouterLink} to="/login" variant="ghost">
            Login
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
