// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Center,
  Heading,
  VStack,
  Flex,
  Button,
  Link as ChakraLink,
  List,
  ListItem,
  ListIcon,
  Text,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  FaPlus,
  FaFileInvoiceDollar,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import AddCreditModal from "../../components/modal/creditModal/components/AddCreditModal";
import RecordPaymentModal from "../../components/modal/recordModal/components/RecordPaymentModal";

// Daftarkan komponen Chart.js yang akan kita gunakan
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("this_month");

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isRecordOpen,
    onOpen: onRecordOpen,
    onClose: onRecordClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let startDate, endDate;
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        switch (dateRange) {
          case "today":
            startDate = now.toISOString();
            endDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              23,
              59,
              59
            ).toISOString();
            break;
          case "this_month":
            startDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              1
            ).toISOString();
            endDate = new Date(
              now.getFullYear(),
              now.getMonth() + 1,
              0,
              23,
              59,
              59
            ).toISOString();
            break;
          case "this_year":
            startDate = new Date(now.getFullYear(), 0, 1).toISOString();
            endDate = new Date(
              now.getFullYear(),
              11,
              31,
              23,
              59,
              59
            ).toISOString();
            break;
          default: // all_time
            startDate = null;
            endDate = null;
            break;
        }

        // Ambil semua data transaksi (Piutang dan Utang)
        let query = supabase
          .from("transactions")
          .select(
            "id, amount, current_amount, type, status, created_at, contacts(id, name), due_date"
          )
          .in("type", ["Piutang", "Utang"]);

        if (startDate && endDate) {
          query = query.gte("created_at", startDate).lte("created_at", endDate);
        }

        const { data: allTransactions, error: transactionsError } = await query;
        if (transactionsError) throw transactionsError;
        console.log("Data Transaksi:", allTransactions);
        // Ambil data pembayaran
        let paymentsQuery = supabase
          .from("payments")
          .select("amount, created_at");
        if (startDate && endDate) {
          paymentsQuery = paymentsQuery
            .gte("created_at", startDate)
            .lte("created_at", endDate);
        }
        const { data: payments, error: paymentsError } = await paymentsQuery;
        if (paymentsError) throw paymentsError;
        console.log("Data Pembayaran:", payments);
        // --- Kalkulasi untuk Ringkasan Utama ---
        let totalOngoingCredits = 0;
        let totalOverdueCredits = 0;
        let totalOutstandingCount = 0;
        let totalDebts = 0;

        const outstandingTransactions = allTransactions.filter(
          (tx) => tx.status !== "Lunas"
        );

        outstandingTransactions.forEach((tx) => {
          if (tx.type === "Piutang") {
            totalOngoingCredits += tx.current_amount;
            totalOutstandingCount++; // PERBAIKI BARIS INI
            if (tx.status === "Jatuh Tempo") {
              totalOverdueCredits += tx.current_amount;
            }
          } else if (tx.type === "Utang") {
            totalDebts += tx.current_amount;
          }
        });

        let totalCollected = 0;
        payments.forEach((payment) => {
          totalCollected += payment.amount;
        });

        const netTotal = totalOngoingCredits + totalOverdueCredits - totalDebts;

        // --- Kalkulasi untuk Laporan Umur Piutang ---
        let agingBuckets = {
          "1-30 hari": 0,
          "31-60 hari": 0,
          "61-90 hari": 0,
          "> 90 hari": 0,
        };
        const today = new Date();

        const overdueCredits = allTransactions.filter(
          (tx) => tx.type === "Piutang" && tx.status === "Jatuh Tempo"
        );

        overdueCredits.forEach((tx) => {
          if (tx.due_date) {
            const dueDate = new Date(tx.due_date);
            const diffTime = today.getTime() - dueDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
              if (diffDays <= 30) {
                agingBuckets["1-30 hari"] += tx.current_amount;
              } else if (diffDays <= 60) {
                agingBuckets["31-60 hari"] += tx.current_amount;
              } else if (diffDays <= 90) {
                agingBuckets["61-90 hari"] += tx.current_amount;
              } else {
                agingBuckets["> 90 hari"] += tx.current_amount;
              }
            }
          }
        });

        // --- Kalkulasi untuk Grafik ---
        const creditsForCharts = allTransactions.filter(
          (tx) => tx.type === "Piutang"
        );

        const statusCounts = creditsForCharts.reduce((acc, tx) => {
          acc[tx.status] = (acc[tx.status] || 0) + 1;
          return acc;
        }, {});
        const statusChartData = {
          labels: Object.keys(statusCounts),
          datasets: [
            {
              data: Object.values(statusCounts),
              backgroundColor: ["#4299e1", "#e53e3e", "#38a169"],
            },
          ],
        };

        const monthlyData = creditsForCharts.reduce((acc, tx) => {
          const month = new Date(tx.created_at).toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          acc[month] = (acc[month] || 0) + tx.amount;
          return acc;
        }, {});
        const monthlyChartData = {
          labels: Object.keys(monthlyData),
          datasets: [
            {
              label: "Total Piutang Dibuat",
              data: Object.values(monthlyData),
              borderColor: "#3182ce",
              tension: 0.1,
            },
          ],
        };

        const contactData = creditsForCharts.reduce((acc, tx) => {
          if (tx.status !== "Lunas" && tx.contacts) {
            const contactName = tx.contacts.name;
            acc[contactName] = (acc[contactName] || 0) + tx.current_amount;
          }
          return acc;
        }, {});
        const topContacts = Object.entries(contactData)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5);
        const contactChartData = {
          labels: topContacts.map(([name]) => name),
          datasets: [
            {
              label: "Total Piutang",
              data: topContacts.map(([, total]) => total),
              backgroundColor: "#38a169",
            },
          ],
        };

        const recentActivities = allTransactions
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);

        setData({
          totalOngoingCredits,
          totalOverdueCredits,
          totalOutstandingCount,
          totalCollected,
          totalDebts,
          netTotal,
          agingReport: agingBuckets,
          statusChartData,
          monthlyChartData,
          contactChartData,
          recentActivities,
        });
        console.log("Final Data State:", {
          totalOngoingCredits,
          totalOverdueCredits,
          totalOutstandingCount,
          totalCollected,
          totalDebts,
          netTotal,
          agingReport: agingBuckets,
          statusChartData,
          monthlyChartData,
          contactChartData,
          recentActivities,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const formatCurrency = (amount) => `Rp ${amount.toLocaleString("id-ID")}`;

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={6}>
        Dashboard
      </Heading>

      <Flex mb={6} justify="flex-end">
        <Select
          placeholder="Pilih Periode"
          width="200px"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="today">Hari Ini</option>
          <option value="this_month">Bulan Ini</option>
          <option value="this_year">Tahun Ini</option>
          <option value="all_time">Sepanjang Waktu</option>
        </Select>
      </Flex>

      {/* 1. Ringkasan Utama (At-a-Glance) */}
      <Heading as="h2" size="lg" mb={4}>
        Ringkasan Keuangan
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
        <StatCard
          label="Total Bersih"
          value={formatCurrency(data?.netTotal || 0)}
          bg={data?.netTotal >= 0 ? "green.50" : "red.50"}
        />
        <StatCard
          label="Total Piutang Berjalan"
          value={formatCurrency(data?.totalOngoingCredits || 0)}
        />
        <StatCard
          label="Total Piutang Jatuh Tempo"
          value={formatCurrency(data?.totalOverdueCredits || 0)}
        />
        <StatCard
          label="Jumlah Piutang Belum Lunas"
          value={`${data?.totalOutstandingCount || 0} Transaksi`}
        />
        <StatCard
          label="Total Tertagih"
          value={formatCurrency(data?.totalCollected || 0)}
        />
      </SimpleGrid>

      {/* Bagian untuk Laporan Umur Piutang */}
      <Heading as="h2" size="lg" mt={8} mb={4}>
        Laporan Umur Piutang
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <AgingReportCard
          label="1-30 Hari"
          value={data?.agingReport["1-30 hari"] || 0}
        />
        <AgingReportCard
          label="31-60 Hari"
          value={data?.agingReport["31-60 hari"] || 0}
        />
        <AgingReportCard
          label="61-90 Hari"
          value={data?.agingReport["61-90 hari"] || 0}
        />
        <AgingReportCard
          label="> 90 Hari"
          value={data?.agingReport["> 90 hari"] || 0}
        />
      </SimpleGrid>

      {/* 2. Visualisasi Data (Grafik) */}
      <Heading as="h2" size="lg" mb={4}>
        Analisis Piutang
      </Heading>
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mb={8}>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>
            Piutang Berdasarkan Status
          </Heading>
          <Pie data={data?.statusChartData} />
        </Box>
        <Box
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
          gridColumn={{ lg: "span 2" }}
        >
          <Heading size="md" mb={4}>
            Tren Piutang (Berdasarkan Bulan)
          </Heading>
          <Line data={data?.monthlyChartData} />
        </Box>
        <Box
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
          gridColumn={{ lg: "span 3" }}
        >
          <Heading size="md" mb={4}>
            Top 5 Kontak dengan Piutang Terbesar
          </Heading>
          <Bar data={data?.contactChartData} />
        </Box>
      </SimpleGrid>

      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        {/* 3. Aksi Cepat (Quick Actions) */}
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" flex="1">
          <Heading as="h2" size="lg" mb={4}>
            Aksi Cepat
          </Heading>
          <VStack spacing={4} align="stretch">
            <ButtonAction
              icon={<FaPlus />}
              label="Tambah Piutang Baru"
              onClick={onAddOpen}
            />
            <ButtonAction
              icon={<FaFileInvoiceDollar />}
              label="Catat Pembayaran"
              onClick={onRecordOpen}
            />
            <ButtonAction
              icon={<FaArrowRight />}
              label="Lihat Semua Piutang"
              as={RouterLink}
              to="/credits"
            />
          </VStack>
        </Box>

        {/* 4. Aktivitas Terbaru */}
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" flex="2">
          <Heading as="h2" size="lg" mb={4}>
            Aktivitas Terbaru
          </Heading>
          <List spacing={3}>
            {data?.recentActivities?.map((tx) => (
              <ListItem key={tx.id}>
                <ListIcon
                  as={tx.status === "Lunas" ? FaCheckCircle : FaClock}
                  color={tx.status === "Lunas" ? "green.500" : "blue.500"}
                />
                <Text as="span" fontWeight="bold">
                  {tx.contacts?.name || "Kontak Tidak Dikenal"}
                </Text>
                <Text as="span" ml={2}>
                  telah {tx.status === "Lunas" ? "melunasi" : "membuat"} piutang
                  sebesar {formatCurrency(tx.amount)}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  pada {new Date(tx.created_at).toLocaleDateString()}
                </Text>
              </ListItem>
            ))}
          </List>
        </Box>
      </Flex>
      <AddCreditModal isOpen={isAddOpen} onClose={onAddClose} />
      <RecordPaymentModal isOpen={isRecordOpen} onClose={onRecordClose} />
    </Box>
  );
};

const AgingReportCard = ({ label, value }) => (
  <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
    <Stat>
      <StatLabel>{label}</StatLabel>
      <StatNumber>Rp {value.toLocaleString("id-ID")}</StatNumber>
    </Stat>
  </Box>
);

const StatCard = ({ label, value, bg }) => (
  <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg={bg}>
    <Stat>
      <StatLabel>{label}</StatLabel>
      <StatNumber>{value}</StatNumber>
    </Stat>
  </Box>
);

const ButtonAction = ({ icon, label, onClick, ...props }) => (
  <Button
    leftIcon={icon}
    width="100%"
    colorScheme="blue"
    variant="outline"
    justifyContent="flex-start"
    height="50px"
    onClick={onClick}
    {...props}
  >
    {label}
  </Button>
);

export default Dashboard;
