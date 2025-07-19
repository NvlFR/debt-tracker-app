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
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
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
  Select,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchTransactionsByType,
  addTransaction,
  fetchContactsByUser,
  fetchCategoriesByUser,
  updateTransaction,
  deleteTransaction,
} from "../api/dataApi";
import Navbar from "../components/layout/Navbar";

const DebtsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [debts, setDebts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDebt, setNewDebt] = useState({
    amount: "",
    description: "",
    contactId: "",
    categoryId: "",
    dueDate: "",
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchData = async () => {
    try {
      const [debtTransactions, contactData, categoryData] = await Promise.all([
        fetchTransactionsByType(user.id, "utang"),
        fetchContactsByUser(user.id),
        fetchCategoriesByUser(user.id),
      ]);
      setDebts(debtTransactions);
      setContacts(contactData);
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

  const handleAddDebt = async () => {
    try {
      if (!newDebt.contactId || !newDebt.categoryId) {
        return;
      }
      const transactionData = {
        ...newDebt,
        amount: parseFloat(newDebt.amount),
        currentAmount: parseFloat(newDebt.amount),
        type: "utang",
        status: "ongoing",
        userId: user.id,
        createdAt: new Date().toISOString(),
      };
      await addTransaction(transactionData);
      fetchData();
      onClose();
      setNewDebt({
        amount: "",
        description: "",
        contactId: "",
        categoryId: "",
        dueDate: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    onEditOpen();
  };

  const handleUpdateTransaction = async () => {
    try {
      await updateTransaction(selectedTransaction.id, selectedTransaction);
      fetchData();
      onEditClose();
      setSelectedTransaction(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await deleteTransaction(transactionId);
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

  const totalDebts = debts.reduce((sum, t) => sum + t.currentAmount, 0);

  return (
    <Box>
      <Navbar />
      <Box p={8}>
        <Flex mb={6} alignItems="center">
          <Heading>Daftar Utang</Heading>
          <Spacer />
          <Button colorScheme="teal" onClick={onOpen}>
            Tambah Utang Baru
          </Button>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={8}>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Stat>
              <StatLabel>Total Utang Anda</StatLabel>
              <StatNumber fontSize="3xl" color="red.500">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(totalDebts)}
              </StatNumber>
            </Stat>
          </Box>
        </SimpleGrid>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>
            Transaksi Terbaru
          </Heading>
          {debts.length === 0 ? (
            <Text>Tidak ada utang yang tercatat.</Text>
          ) : (
            <List spacing={3}>
              {debts.map((debt) => (
                <ListItem
                  key={debt.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                >
                  <Flex alignItems="center">
                    <Box>
                      <Text fontWeight="bold" color="red.500">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(debt.currentAmount)}
                      </Text>
                      <Text fontSize="sm">
                        {debt.contact
                          ? debt.contact.name
                          : "Kontak tidak diketahui"}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Kategori:{" "}
                        {debt.category
                          ? debt.category.name
                          : "Tidak ada kategori"}
                      </Text>
                    </Box>
                    <Spacer />
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>
                        Jatuh Tempo: {debt.dueDate}
                      </Text>
                      <Flex>
                        <IconButton
                          icon={<EditIcon />}
                          mr={2}
                          size="sm"
                          onClick={() => handleEditClick(debt)}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteTransaction(debt.id)}
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

      {/* Modal untuk Tambah Utang */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Utang Baru</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Jumlah</FormLabel>
                <Input
                  type="number"
                  value={newDebt.amount}
                  onChange={(e) =>
                    setNewDebt({ ...newDebt, amount: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Deskripsi</FormLabel>
                <Input
                  value={newDebt.description}
                  onChange={(e) =>
                    setNewDebt({ ...newDebt, description: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Pihak Terkait</FormLabel>
                <Select
                  placeholder="Pilih Pihak"
                  value={newDebt.contactId}
                  onChange={(e) =>
                    setNewDebt({ ...newDebt, contactId: e.target.value })
                  }
                >
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Kategori</FormLabel>
                <Select
                  placeholder="Pilih Kategori"
                  value={newDebt.categoryId}
                  onChange={(e) =>
                    setNewDebt({ ...newDebt, categoryId: e.target.value })
                  }
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Tanggal Jatuh Tempo</FormLabel>
                <Input
                  type="date"
                  value={newDebt.dueDate}
                  onChange={(e) =>
                    setNewDebt({ ...newDebt, dueDate: e.target.value })
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddDebt}>
              Simpan
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal untuk Edit Transaksi */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Utang</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTransaction && (
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Jumlah</FormLabel>
                  <Input
                    type="number"
                    value={selectedTransaction.amount}
                    onChange={(e) =>
                      setSelectedTransaction({
                        ...selectedTransaction,
                        amount: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Deskripsi</FormLabel>
                  <Input
                    value={selectedTransaction.description}
                    onChange={(e) =>
                      setSelectedTransaction({
                        ...selectedTransaction,
                        description: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Pihak Terkait</FormLabel>
                  <Select
                    placeholder="Pilih Pihak"
                    value={selectedTransaction.contactId}
                    onChange={(e) =>
                      setSelectedTransaction({
                        ...selectedTransaction,
                        contactId: e.target.value,
                      })
                    }
                  >
                    {contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Kategori</FormLabel>
                  <Select
                    placeholder="Pilih Kategori"
                    value={selectedTransaction.categoryId}
                    onChange={(e) =>
                      setSelectedTransaction({
                        ...selectedTransaction,
                        categoryId: e.target.value,
                      })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Tanggal Jatuh Tempo</FormLabel>
                  <Input
                    type="date"
                    value={selectedTransaction.dueDate}
                    onChange={(e) =>
                      setSelectedTransaction({
                        ...selectedTransaction,
                        dueDate: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleUpdateTransaction}>
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

export default DebtsPage;
