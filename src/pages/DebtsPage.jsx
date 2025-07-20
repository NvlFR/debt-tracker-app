import { useEffect, useState } from "react";
// src/pages/DebtsPage.jsx
import {
  Box,
  Heading,
  Text,
  Spinner,
  Center,
  List,
  ListItem,
  Flex,
  Spacer,
  Badge,
  IconButton,
  Alert,
  AlertIcon,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  SimpleGrid, // <-- Tambahkan ini
  Stat, // <-- Pastikan juga ada
  StatLabel, // <-- Pastikan juga ada
  StatNumber, // <-- Pastikan juga ada
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchTransactionsByType,
  fetchContactsByUser,
  fetchCategoriesByUser,
  deleteTransaction,
  updateTransactionStatus,
  fetchPaymentsByTransactionId,
} from "../api/dataApi";
import AddDebtModal from "../components/modal/debtModal/components/AddDebtModal";
import EditDebtModal from "../components/modal/debtModal/components/EditDebtModal";
import RecordPartialPaymentModal from "../components/modal/recordModal/components/RecordPartialPaymentModal";

const DebtsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
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
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();

  const [debts, setDebts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [payments, setPayments] = useState([]);

  const fetchData = async () => {
    try {
      if (!user) return;
      const [debtTransactions, contactData, categoryData] = await Promise.all([
        fetchTransactionsByType(user.id, "utang"),
        fetchContactsByUser(user.id),
        fetchCategoriesByUser(user.id),
      ]);

      const enrichedDebts = debtTransactions.map((debt) => ({
        ...debt,
        contact: contactData.find((c) => c.id === debt.contactId),
        category: categoryData.find((cat) => cat.id === debt.categoryId),
      }));

      setDebts(enrichedDebts);
      setContacts(contactData);
      setCategories(categoryData);
    } catch (err) {
      console.error("Error fetching data:", err);
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

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    onEditOpen();
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await deleteTransaction(transactionId);
      fetchData();
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError(err.message);
    }
  };

  const handleOpenPartialPayment = (transaction) => {
    setSelectedTransaction(transaction);
    onPartialPaymentOpen();
  };

  const handleMarkAsPaid = async (transaction) => {
    try {
      await updateTransactionStatus(transaction.id, "paid");
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewDetails = async (transaction) => {
    try {
      const fetchedPayments = await fetchPaymentsByTransactionId(
        transaction.id
      );
      setSelectedTransaction(transaction);
      setPayments(fetchedPayments);
      onDetailOpen();
    } catch (err) {
      toast({
        title: "Gagal memuat detail.",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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

  const totalDebts = debts
    .filter((t) => t.status === "ongoing")
    .reduce((sum, t) => sum + t.currentAmount, 0);

  return (
    <Box>
      <Box p={8}>
        <Flex mb={6} alignItems="center">
          <Heading>Daftar Utang</Heading>
          <Spacer />
          <Button colorScheme="teal" onClick={onAddOpen}>
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
                <LinkBox
                  as={ListItem}
                  key={debt.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  _hover={{ bg: "gray.700" }}
                  cursor="pointer"
                >
                  <LinkOverlay onClick={() => handleViewDetails(debt)}>
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
                        <Flex mb={2} justifyContent="flex-end">
                          {debt.status === "paid" ? (
                            <Tag colorScheme="green">Lunas</Tag>
                          ) : (
                            <Tag colorScheme="red">Sedang Berjalan</Tag>
                          )}
                        </Flex>
                        <Flex>
                          {debt.status === "ongoing" &&
                            debt.currentAmount > 0 && (
                              <>
                                <Button
                                  size="sm"
                                  mr={2}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenPartialPayment(debt);
                                  }}
                                >
                                  Bayar
                                </Button>
                                {debt.currentAmount === debt.amount && (
                                  <Button
                                    size="sm"
                                    colorScheme="green"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkAsPaid(debt);
                                    }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(debt);
                            }}
                          />
                          <IconButton
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTransaction(debt.id);
                            }}
                          />
                        </Flex>
                      </Box>
                    </Flex>
                  </LinkOverlay>
                </LinkBox>
              ))}
            </List>
          )}
        </Box>
      </Box>

      {/* Gunakan komponen modal yang baru */}
      <AddDebtModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        onAddSuccess={fetchData}
        contacts={contacts}
        categories={categories}
      />

      <EditDebtModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        transaction={selectedTransaction}
        onUpdateSuccess={fetchData}
        contacts={contacts}
        categories={categories}
      />

      <RecordPartialPaymentModal
        isOpen={isPartialPaymentOpen}
        onClose={onPartialPaymentClose}
        transaction={selectedTransaction}
        onPaymentSuccess={fetchData}
      />

      {/* Modal Detail tetap di sini karena spesifik */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detail Transaksi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTransaction && (
              <Stack spacing={3}>
                <Text>
                  Jumlah Awal:{" "}
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(selectedTransaction.amount)}
                </Text>
                <Text>
                  Sisa Utang:{" "}
                  <Badge
                    colorScheme={
                      selectedTransaction.status === "paid" ? "green" : "red"
                    }
                  >
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(selectedTransaction.currentAmount)}
                  </Badge>
                </Text>
                <Text>
                  Status:{" "}
                  <Badge
                    colorScheme={
                      selectedTransaction.status === "paid" ? "green" : "red"
                    }
                  >
                    {selectedTransaction.status === "paid"
                      ? "Lunas"
                      : "Sedang Berjalan"}
                  </Badge>
                </Text>
                <Text>Deskripsi: {selectedTransaction.description}</Text>
                <Text>
                  Pihak Terkait:{" "}
                  {selectedTransaction.contact
                    ? selectedTransaction.contact.name
                    : "Tidak diketahui"}
                </Text>
                <Text>
                  Kategori:{" "}
                  {selectedTransaction.category
                    ? selectedTransaction.category.name
                    : "Tidak ada"}
                </Text>
                <Text>Tanggal Jatuh Tempo: {selectedTransaction.dueDate}</Text>
                <Heading size="sm" mt={4}>
                  Riwayat Pembayaran
                </Heading>
                {payments.length === 0 ? (
                  <Text>Belum ada pembayaran.</Text>
                ) : (
                  <List spacing={2}>
                    {payments.map((payment) => (
                      <ListItem
                        key={payment.id}
                        p={2}
                        bg="gray.100"
                        borderRadius="md"
                      >
                        <Stack spacing={0}>
                          <Text fontWeight="bold">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(payment.amount)}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </Text>
                        </Stack>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={onDetailClose}>
              Tutup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DebtsPage;
