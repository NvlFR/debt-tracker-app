// src/components/dashboard/TransactionChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from '../../contexts/ThemeContext'; // Untuk menyesuaikan warna grafik dengan tema

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TransactionChart = ({ data }) => {
  const { theme } = useTheme();

  // Warna garis dan teks grafik berdasarkan tema
  const debtColor = theme === 'dark' ? '#EF4444' : '#DC2626'; // Red-500 / Red-600
  const receivableColor = theme === 'dark' ? '#22C55E' : '#10B981'; // Green-500 / Green-600
  const textColor = theme === 'dark' ? '#E2E8F0' : '#1F2937'; // Slate-200 / Gray-900
  const gridColor = theme === 'dark' ? '#475569' : '#E5E7EB'; // Slate-600 / Gray-200

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Total Utang',
        data: data.debts,
        borderColor: debtColor,
        backgroundColor: debtColor + '33', // Sedikit transparan
        tension: 0.3,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: debtColor,
        pointBorderColor: '#fff',
        pointHoverRadius: 7,
      },
      {
        label: 'Total Piutang',
        data: data.receivables,
        borderColor: receivableColor,
        backgroundColor: receivableColor + '33',
        tension: 0.3,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: receivableColor,
        pointBorderColor: '#fff',
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Penting untuk kontrol ukuran di Tailwind
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor, // Warna teks legend
        },
      },
      title: {
        display: false,
        text: 'Grafik Utang & Piutang Bulanan',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColor, // Warna teks sumbu X
        },
        grid: {
          color: gridColor, // Warna garis grid X
        },
      },
      y: {
        ticks: {
          color: textColor, // Warna teks sumbu Y
          callback: function(value) {
            return new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
          }
        },
        grid: {
          color: gridColor, // Warna garis grid Y
        },
      },
    },
  };

  return (
    <div className="relative h-64 md:h-80 lg:h-96"> {/* Kontrol tinggi grafik */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TransactionChart;