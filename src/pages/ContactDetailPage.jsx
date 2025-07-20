// src/pages/ContactDetailPage.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
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
  Badge,
  Stack,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchContactById, fetchTransactionsByContact } from "../api/dataApi";

const ContactDetailPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { contactId } = useParams();

  const [contact, setContact] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Panggil fungsi fetchContactById dengan user.id
        const fetchedContact = await fetchContactById(contactId, user.id);
        const fetchedTransactions = await fetchTransactionsByContact(
          user.id,
          contactId
        );

        setContact(fetchedContact);
        setTransactions(fetchedTransactions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, contactId]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Jika kontak tidak ditemukan (karena ID tidak valid atau bukan milik user)
  if (error || !contact) {
    return (
      <Center h="100vh">
        <Alert status="warning" maxW="md">
          <AlertIcon />
          Kontak tidak ditemukan atau Anda tidak memiliki akses ke kontak ini.
        </Alert>
      </Center>
    );
  }

  // Menghitung ringkasan transaksi
  const debtTransactions = transactions.filter((t) => t.type === "utang");
  const creditTransactions = transactions.filter((t) => t.type === "piutang");
  const totalDebtCount = debtTransactions.length;
  const totalCreditCount = creditTransactions.length;
  const totalDebtNominal = debtTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );
  const totalCreditNominal = creditTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  return (
    <Box>
      <Box p={8}>
        <Flex mb={6} alignItems="center">
          <Heading>Detail Kontak</Heading>
          <Spacer />
        </Flex>

        <Box p={6} mb={8} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="lg" mb={2}>
            {contact.name}
          </Heading>
          <Text fontSize="md" color="gray.500">
            Email: {contact.email}
          </Text>
          <Text fontSize="md" color="gray.500">
            Nomor HP: {contact.phone}
          </Text>
        </Box>

        <Box p={6} mb={8} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>
            Ringkasan Transaksi
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Box>
              <Stat>
                <StatLabel>Total Utang</StatLabel>
                <StatNumber fontSize="2xl" color="red.500">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(totalDebtNominal)}
                </StatNumber>
                <Text fontSize="sm" color="gray.500">
                  ({totalDebtCount} transaksi)
                </Text>
              </Stat>
            </Box>
            <Box>
              <Stat>
                <StatLabel>Total Piutang</StatLabel>
                <StatNumber fontSize="2xl" color="green.500">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(totalCreditNominal)}
                </StatNumber>
                <Text fontSize="sm" color="gray.500">
                  ({totalCreditCount} transaksi)
                </Text>
              </Stat>
            </Box>
          </SimpleGrid>
        </Box>

        <Box p={6} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>
            Riwayat Transaksi
          </Heading>
          {transactions.length === 0 ? (
            <Text>Belum ada riwayat transaksi dengan kontak ini.</Text>
          ) : (
            <List spacing={3}>
              {transactions.map((transaction) => (
                <ListItem
                  key={transaction.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                >
                  <Flex alignItems="center">
                    <Stack spacing={0}>
                      <Text
                        fontWeight="bold"
                        color={
                          transaction.type === "utang" ? "red.500" : "green.500"
                        }
                      >
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(transaction.amount)}
                      </Text>
                      <Text fontSize="sm">{transaction.description}</Text>
                    </Stack>
                    <Spacer />
                    <Box textAlign="right">
                      <Badge
                        colorScheme={
                          transaction.type === "utang" ? "red" : "green"
                        }
                        mb={1}
                      >
                        {transaction.type === "utang" ? "Utang" : "Piutang"}
                      </Badge>
                      <Badge
                        colorScheme={
                          transaction.status === "paid" ? "green" : "orange"
                        }
                        ml={2}
                      >
                        {transaction.status === "paid"
                          ? "Lunas"
                          : "Sedang Berjalan"}
                      </Badge>
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </Text>
                    </Box>
                  </Flex>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ContactDetailPage;
