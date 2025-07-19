import { useEffect, useState, useCallback } from "react";
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
  useToast,
  LinkBox,
  LinkOverlay,
  Badge,
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
  fetchPaymentsByTransactionId,
} from "../api/dataApi";
import Navbar from "../components/layout/Navbar";

const CreditsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
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
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();

  const [credits, setCredits] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCredit, setNewCredit] = useState({
    amount: "",
    description: "",
    contactId: "",
    categoryId: "",
    dueDate: "",
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [payments, setPayments] = useState([]);

  // Menggunakan useCallback untuk memoize fungsi fetchData
  const fetchData = useCallback(async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [creditTransactions, contactData, categoryData] = await Promise.all(
        [
          fetchTransactionsByType(user.id, "piutang"),
          fetchContactsByUser(user.id),
          fetchCategoriesByUser(user.id),
        ]
      );

      // Memperkaya data transaksi dengan nama kontak dan kategori
      const enrichedCredits = creditTransactions.map((credit) => ({
        ...credit,
        contact: contactData.find((c) => c.id === credit.contactId),
        category: categoryData.find((cat) => cat.id === credit.categoryId),
      }));

      setCredits(enrichedCredits);
      setContacts(contactData);
      setCategories(categoryData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddCredit = async () => {
    if (!newCredit.amount || !newCredit.contactId || !newCredit.categoryId || !newCredit.dueDate) {
      toast({
        title: "Input tidak valid.",
        description: "Semua kolom harus diisi.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
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
      toast({
        title: "Piutang baru berhasil ditambahkan.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to add credit:", err);
      toast({
        title: "Gagal menambah piutang.",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (transaction) => {
    setSelectedTransaction({
      ...transaction,
      // Memastikan format tanggal kompatibel dengan input type="date"
      dueDate: transaction.dueDate.split('T')[0],
      amount: transaction.amount.toString(),
    });
    onEditOpen();
  };

  const handleUpdateTransaction = async () => {
    if (!selectedTransaction.amount || !selectedTransaction.contactId || !selectedTransaction.categoryId || !selectedTransaction.dueDate) {
      toast({
        title: "Input tidak valid.",
        description: "Semua kolom harus diisi.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateTransaction(selectedTransaction.id, {
        ...selectedTransaction,
        amount: parseFloat(selectedTransaction.amount),
      });
      fetchData();
      onEditClose();
      setSelectedTransaction(null);
      toast({
        title: "Piutang berhasil diperbarui.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to update transaction:", err);
      toast({
        title: "Gagal memperbarui piutang.",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus piutang ini?")) {
      return;
    }
    try {
      await deleteTransaction(transactionId);
      fetchData();
      toast({
        title: "Piutang berhasil dihapus.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      toast({
        title: "Gagal menghapus piutang.",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleOpenPartialPayment = (transaction) => {
    setSelectedTransaction(transaction);
    setPaymentAmount(""); // Reset nilai saat modal dibuka
    onPartialPaymentOpen();
  };

  const handlePartialPayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0 || amount > selectedTransaction.currentAmount) {
      toast({
        title: "Pembayaran tidak valid.",
        description: "Jumlah harus positif dan tidak melebihi sisa piutang.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newCurrentAmount = selectedTransaction.currentAmount - amount;
      const newStatus = newCurrentAmount <= 0 ? "paid" : "ongoing";

      await updateTransaction(selectedTransaction.id, {
        ...selectedTransaction,
        currentAmount: newCurrentAmount,
        status: newStatus,
      });

      const paymentData = {
        transactionId: selectedTransaction.id,
        amount: amount,
        createdAt: new Date().toISOString(),
      };
      await addPayment(paymentData);

      fetchData();
      onPartialPaymentClose();
      setPaymentAmount("");
      toast({
        title: "Pembayaran berhasil disimpan.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to save partial payment:", err);
      toast({
        title: "Gagal menyimpan pembayaran.",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = async (transaction) => {
    setLoading(true);
    onDetailOpen();
    try {
      const fetchedPayments = await fetchPaymentsByTransactionId(transaction.id);
      setSelectedTransaction(transaction);
      setPayments(fetchedPayments);
    } catch (err) {
      console.error("Failed to load details:", err);
      toast({
        title: "Gagal memuat detail.",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (transaction) => {
    if (!window.confirm("Apakah Anda yakin ingin menandai piutang ini sebagai lunas?")) {
      return;
    }
    try {
      await updateTransactionStatus(transaction.id, "paid");
      fetchData();
      toast({
        title: "Status piutang berhasil diperbarui menjadi lunas.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to mark as paid:", err);
      toast({
        title: "Gagal memperbarui status.",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const totalCredits = credits
    .filter((t) => t.status === "ongoing")
    .reduce((sum, t) => sum + t.currentAmount, 0);

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "Tidak ada tanggal";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
            Daftar Transaksi Piutang
          </Heading>
          {credits.length === 0 ? (
            <Text>Tidak ada piutang yang tercatat.</Text>
          ) : (
            <List spacing={3}>
              {credits.map((credit) => (
                <LinkBox
                  as={ListItem}
                  key={credit.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  _hover={{ bg: "gray.700" }}
                  cursor="pointer"
                >
                  <LinkOverlay onClick={() => handleViewDetails(credit)}>
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
                          {credit.contact ? credit.contact.name : "Kontak tidak diketahui"}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Kategori:{" "}
                          {credit.category ? credit.category.name : "Tidak ada kategori"}
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
                          {credit.status === "ongoing" && credit.currentAmount > 0 && (
                            <Button
                              size="sm"
                              mr={2}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenPartialPayment(credit);
                              }}
                            >
                              Bayar
                            </Button>
                          )}
                          {credit.status === "ongoing" && (
                            <IconButton
                              icon={<CheckCircleIcon />}
                              size="sm"
                              mr={2}
                              colorScheme="green"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsPaid(credit);
                              }}
                              aria-label="Tandai sebagai Lunas"
                            />
                          )}
                          <IconButton
                            icon={<EditIcon />}
                            mr={2}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(credit);
                            }}
                            aria-label="Edit Transaksi"
                          />
                          <IconButton
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTransaction(credit.id);
                            }}
                            aria-label="Hapus Transaksi"
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
              <FormControl>
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
            <Button colorScheme="teal" mr={3} onClick={handleAddCredit} isLoading={isSubmitting}>
              Simpan
            </Button>
            <Button variant="ghost" onClick={onClose} isDisabled={isSubmitting}>
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
                        amount: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl>
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
            <Button colorScheme="teal" mr={3} onClick={handleUpdateTransaction} isLoading={isSubmitting}>
              Simpan Perubahan
            </Button>
            <Button variant="ghost" onClick={onEditClose} isDisabled={isSubmitting}>
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
            <Button colorScheme="teal" mr={3} onClick={handlePartialPayment} isLoading={isSubmitting}>
              Simpan Pembayaran
            </Button>
            <Button variant="ghost" onClick={onPartialPaymentClose} isDisabled={isSubmitting}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal untuk Detail Transaksi */}
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
                  Sisa Piutang:{" "}
                  <Badge
                    colorScheme={
                      selectedTransaction.status === "paid" ? "green" : "yellow"
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
                      selectedTransaction.status === "paid" ? "green" : "yellow"
                    }
                  >
                    {selectedTransaction.status === "paid" ? "Lunas" : "Sedang Berjalan"}
                  </Badge>
                </Text>
                <Text>Deskripsi: {selectedTransaction.description}</Text>
                <Text>
                  Pihak Terkait:{" "}
                  {selectedTransaction.contact ? selectedTransaction.contact.name : "Tidak diketahui"}
                </Text>
                <Text>
                  Kategori:{" "}
                  {selectedTransaction.category ? selectedTransaction.category.name : "Tidak ada"}
                </Text>
                <Text>Tanggal Jatuh Tempo: {formatDate(selectedTransaction.dueDate)}</Text>
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
                            {formatDate(payment.createdAt)}
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

export default CreditsPage;