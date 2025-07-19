import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchTransactionsByUser } from "../../api/dataApi";
import Navbar from "../../components/layout/Navbar";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect jika tidak ada user
      return;
    }

    const fetchData = async () => {
      try {
        const transactions = await fetchTransactionsByUser(user.id);
        setData(transactions);
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

  // Hitung total utang dan piutang
  const totalDebts = data
    .filter((t) => t.type === "utang")
    .reduce((sum, t) => sum + t.currentAmount, 0);

  const totalCredits = data
    .filter((t) => t.type === "piutang")
    .reduce((sum, t) => sum + t.currentAmount, 0);

  // Format mata uang
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box>
      <Navbar />
      <Box p={8}>
        <Heading mb={6}>Dashboard, Selamat datang {user.name}!</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading size="lg" mb={4}>
              Ringkasan Keuangan
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <Stat>
                <StatLabel>Total Utang Anda</StatLabel>
                <StatNumber fontSize="3xl" color="red.500">
                  {formatCurrency(totalDebts)}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Total Piutang Anda</StatLabel>
                <StatNumber fontSize="3xl" color="green.500">
                  {formatCurrency(totalCredits)}
                </StatNumber>
              </Stat>
            </SimpleGrid>
          </Box>
        </SimpleGrid>
        {/* TODO: Tambahkan bagian 'Transaksi Terbaru' dan 'Jatuh Tempo Mendekat' */}
      </Box>
    </Box>
  );
};

export default DashboardPage;
