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
  Tag,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchTransactionsByType,
  addTransaction,
  fetchContactsByUser,
  fetchCategoriesByUser,
  updateTransaction,
  deleteTransaction,
  addPayment,
  updateTransactionStatus,
} from "../api/dataApi";
import Navbar from "../components/layout/Navbar";

const CreditsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isPartialPaymentOpen,
    onOpen: onPartialPaymentOpen,
    onClose: onPartialPaymentClose,
  } = useDisclosure();
  const [credits, setCredits] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCredit, setNewCredit] = useState({
    amount: "",
    description: "",
    contactId: "",
    categoryId: "",
    dueDate: "",
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const fetchData = async () => {
    try {
      const [creditTransactions, contactData, categoryData] = await Promise.all(
        [
          fetchTransactionsByType(user.id, "piutang"),
          fetchContactsByUser(user.id),
          fetchCategoriesByUser(user.id),
        ]
      );
      setCredits(creditTransactions);
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

  const handleAddCredit = async () => {
    try {
      if (!newCredit.contactId || !newCredit.categoryId) {
        return;
      }
      const transactionData = {
        ...newCredit,
        amount: parseFloat(newCredit.amount),
        currentAmount: parseFloat(newCredit.amount),
        type: "piutang",
        status: "ongoing",
        userId: user.id,
        createdAt: new Date().toISOString(),
      };
      await addTransaction(transactionData);
      fetchData();
      onClose();
      setNewCredit({
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

  const handleOpenPartialPayment = (transaction) => {
    setSelectedTransaction(transaction);
    onPartialPaymentOpen();
  };

  const handlePartialPayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (
      isNaN(amount) ||
      amount <= 0 ||
      amount > selectedTransaction.currentAmount
    ) {
      alert("Jumlah pembayaran tidak valid.");
      return;
    }
    try {
      // 1. Tambahkan pembayaran ke riwayat pembayaran
      const paymentData = {
        transactionId: selectedTransaction.id,
        amount: amount,
        createdAt: new Date().toISOString(),
      };
      await addPayment(paymentData);

      // 2. Perbarui jumlah sisa transaksi
      const newCurrentAmount = selectedTransaction.currentAmount - amount;
      await updateTransaction(selectedTransaction.id, {
        ...selectedTransaction,
        currentAmount: newCurrentAmount,
      });

      fetchData();
      onPartialPaymentClose();
      setPaymentAmount("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkAsPaid = async (transaction) => {
    try {
      await updateTransactionStatus(transaction.id, "paid");
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

  const totalCredits = credits
    .filter((t) => t.status === "ongoing")
    .reduce((sum, t) => sum + t.currentAmount, 0);

  return (
    <Box>
      <Navbar />
      <Box p={8}>
        <Flex mb={6} alignItems="center">
          <Heading>Daftar Piutang</Heading>
          <Spacer />
          <Button colorScheme="teal" onClick={onOpen}>
            Tambah Piutang Baru
          </Button>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={8}>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Stat>
              <StatLabel>Total Piutang Anda</StatLabel>
              <StatNumber fontSize="3xl" color="green.500">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(totalCredits)}
              </StatNumber>
            </Stat>
          </Box>
        </SimpleGrid>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>
            Transaksi Terbaru
          </Heading>
          {credits.length === 0 ? (
            <Text>Tidak ada piutang yang tercatat.</Text>
          ) : (
            <List spacing={3}>
              {credits.map((credit) => (
                <ListItem
                  key={credit.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                >
                  <Flex alignItems="center">
                    <Box>
                      <Text fontWeight="bold" color="green.500">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(credit.currentAmount)}
                      </Text>
                      <Text fontSize="sm">
                        {credit.contact
                          ? credit.contact.name
                          : "Kontak tidak diketahui"}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Kategori:{" "}
                        {credit.category
                          ? credit.category.name
                          : "Tidak ada kategori"}
                      </Text>
                    </Box>
                    <Spacer />
                    <Box>
                      <Flex mb={2} justifyContent="flex-end">
                        {credit.status === "paid" ? (
                          <Tag colorScheme="green">Lunas</Tag>
                        ) : (
                          <Tag colorScheme="yellow">Sedang Berjalan</Tag>
                        )}
                      </Flex>
                      <Flex>
                        {credit.status === "ongoing" &&
                          credit.currentAmount > 0 && (
                            <>
                              <Button
                                size="sm"
                                mr={2}
                                onClick={() => handleOpenPartialPayment(credit)}
                              >
                                Bayar
                              </Button>
                              {credit.currentAmount === credit.amount && (
                                <Button
                                  size="sm"
                                  colorScheme="green"
                                  onClick={() => handleMarkAsPaid(credit)}
                                >
                                  Lunas
                                </Button>
                              )}
                            </>
                          )}
                        <IconButton
                          icon={<EditIcon />}
                          mr={2}
                          size="sm"
                          onClick={() => handleEditClick(credit)}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteTransaction(credit.id)}
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

      {/* Modal untuk Tambah Piutang */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Piutang Baru</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Jumlah</FormLabel>
                <Input
                  type="number"
                  value={newCredit.amount}
                  onChange={(e) =>
                    setNewCredit({ ...newCredit, amount: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Deskripsi</FormLabel>
                <Input
                  value={newCredit.description}
                  onChange={(e) =>
                    setNewCredit({ ...newCredit, description: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Pihak Terkait</FormLabel>
                <Select
                  placeholder="Pilih Pihak"
                  value={newCredit.contactId}
                  onChange={(e) =>
                    setNewCredit({ ...newCredit, contactId: e.target.value })
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
                  value={newCredit.categoryId}
                  onChange={(e) =>
                    setNewCredit({ ...newCredit, categoryId: e.target.value })
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
                  value={newCredit.dueDate}
                  onChange={(e) =>
                    setNewCredit({ ...newCredit, dueDate: e.target.value })
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddCredit}>
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
          <ModalHeader>Edit Piutang</ModalHeader>
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
                        amount: parseFloat(e.target.value),
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

      {/* Modal untuk Pembayaran Sebagian */}
      <Modal isOpen={isPartialPaymentOpen} onClose={onPartialPaymentClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bayar Sebagian</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTransaction && (
              <Stack spacing={4}>
                <Text>
                  Sisa Piutang:
                  <Text as="span" fontWeight="bold" ml={1}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(selectedTransaction.currentAmount)}
                  </Text>
                </Text>
                <FormControl isRequired>
                  <FormLabel>Jumlah Pembayaran</FormLabel>
                  <Input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </FormControl>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handlePartialPayment}>
              Simpan Pembayaran
            </Button>
            <Button variant="ghost" onClick={onPartialPaymentClose}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreditsPage;
