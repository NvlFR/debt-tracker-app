import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  List,
  ListItem,
  Flex,
  Spacer,
  Badge,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchPaymentsByUser, fetchTransactionsByUser } from "../api/dataApi";

const PaymentHistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const allPayments = await fetchPaymentsByUser(user.id);
        const allTransactions = await fetchTransactionsByUser(user.id);

        const enrichedPayments = allPayments.map((payment) => {
          const transaction = allTransactions.find(
            (t) => t.id === payment.transactionId
          );
          return {
            ...payment,
            transactionType: transaction?.type,
            transactionDescription: transaction?.description,
          };
        });

        setPayments(enrichedPayments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

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
        <Heading mb={6}>Riwayat Pembayaran</Heading>
        {payments.length === 0 ? (
          <Text>Belum ada riwayat pembayaran yang tercatat.</Text>
        ) : (
          <List spacing={3}>
            {payments.map((payment) => (
              <ListItem
                key={payment.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
              >
                <Flex alignItems="center">
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
                  <Spacer />
                  <Box textAlign="right">
                    <Badge
                      colorScheme={
                        payment.transactionType === "piutang" ? "green" : "red"
                      }
                      mb={1}
                    >
                      {payment.transactionType === "piutang"
                        ? "Piutang"
                        : "Utang"}
                    </Badge>
                    <Text fontSize="sm" color="gray.500">
                      {payment.transactionDescription}
                    </Text>
                  </Box>
                </Flex>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default PaymentHistoryPage;
