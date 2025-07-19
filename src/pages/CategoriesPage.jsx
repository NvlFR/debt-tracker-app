import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  List,
  ListItem,
  Flex,
  Spacer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchCategoriesByUser,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../api/dataApi";
import Navbar from "../components/layout/Navbar";

const CategoriesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchData = async () => {
    try {
      const categoryData = await fetchCategoriesByUser(user.id);
      setCategories(categoryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const handleAddCategory = async () => {
    try {
      const categoryData = {
        ...newCategory,
        userId: user.id,
      };
      await addCategory(categoryData);
      fetchData();
      onClose();
      setNewCategory({ name: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    onEditOpen();
  };

  const handleUpdateCategory = async () => {
    try {
      await updateCategory(selectedCategory.id, selectedCategory);
      fetchData();
      onEditClose();
      setSelectedCategory(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Alert status="error" maxW="md">
          <AlertIcon />
          {error}
        </Alert>
      </Center>
    );
  }

  return (
    <Box>
      <Navbar />
      <Box p={8}>
        <Flex mb={6} alignItems="center">
          <Heading>Daftar Kategori</Heading>
          <Spacer />
          <Button colorScheme="teal" onClick={onOpen}>
            Tambah Kategori Baru
          </Button>
        </Flex>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>
            Kategori Anda
          </Heading>
          {categories.length === 0 ? (
            <Text>Tidak ada kategori yang tercatat.</Text>
          ) : (
            <List spacing={3}>
              {categories.map((category) => (
                <ListItem
                  key={category.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                >
                  <Flex alignItems="center">
                    <Box>
                      <Text fontWeight="bold">{category.name}</Text>
                    </Box>
                    <Spacer />
                    <Box>
                      <Flex>
                        <IconButton
                          icon={<EditIcon />}
                          mr={2}
                          size="sm"
                          onClick={() => handleEditClick(category)}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteCategory(category.id)}
                        />
                      </Flex>
                    </Box>
                  </Flex>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>

      {/* Modal untuk Tambah Kategori */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Kategori Baru</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nama Kategori</FormLabel>
                <Input
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddCategory}>
              Simpan
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal untuk Edit Kategori */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Kategori</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCategory && (
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nama Kategori</FormLabel>
                  <Input
                    value={selectedCategory.name}
                    onChange={(e) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        name: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleUpdateCategory}>
              Simpan Perubahan
            </Button>
            <Button variant="ghost" onClick={onEditClose}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CategoriesPage;
