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
  IconButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchCategoriesByUser, deleteCategory } from "../api/dataApi";
import AddCategoryModal from "../components/AddCategoryModal"; // Import modal yang sudah kita buat
import EditCategoryModal from "../components/EditCategoryModal"; // Asumsikan Anda akan membuat modal ini

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
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchData = async () => {
    try {
      if (!user) return; // Tambahkan cek untuk menghindari error
      const categoryData = await fetchCategoriesByUser(user.id);
      setCategories(categoryData);
    } catch (err) {
      console.error("Error fetching categories:", err);
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

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    onEditOpen();
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      fetchData();
    } catch (err) {
      console.error("Error deleting category:", err);
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

                        <AddCategoryModal
                          isOpen={isOpen}
                          onClose={onClose}
                          onUpdateSuccess={fetchData}
                        />

                        {/* Modal Edit Kategori */}
                        <EditCategoryModal
                          isOpen={isEditOpen}
                          onClose={onEditClose}
                          category={selectedCategory}
                          onUpdateSuccess={fetchData} // Fungsi untuk refresh data
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

      {/* Gunakan modal yang sudah kita buat */}
      <AddCategoryModal isOpen={isOpen} onClose={onClose} />

      {/* Asumsikan Anda akan membuat modal edit juga */}
      {/* <EditCategoryModal 
        isOpen={isEditOpen} 
        onClose={onEditClose} 
        category={selectedCategory} 
      /> */}
    </Box>
  );
};

export default CategoriesPage;
