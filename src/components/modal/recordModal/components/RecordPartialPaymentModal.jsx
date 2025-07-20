// src/components/modal/recordModal/RecordPartialPaymentModal.jsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { addPayment, updateTransactionStatus } from "../../../../api/dataApi";

const RecordPartialPaymentModal = ({
  isOpen,
  onClose,
  transaction,
  onPaymentRecorded,
}) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleRecordPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Jumlah pembayaran tidak valid.",
        description: "Mohon masukkan jumlah pembayaran yang benar.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const paymentAmount = parseFloat(amount);
    const newRemainingAmount = transaction.remaining_amount - paymentAmount;

    if (newRemainingAmount < 0) {
      toast({
        title: "Jumlah pembayaran melebihi sisa utang/piutang.",
        description: `Sisa pembayaran adalah Rp${transaction.remaining_amount.toLocaleString(
          "id-ID"
        )}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      // 1. Tambahkan pembayaran ke tabel 'payments'
      await addPayment({
        amount: paymentAmount,
        transaction_id: transaction.id,
      });

      // 2. Perbarui sisa jumlah di tabel 'transactions'
      const updatedTransactionData = {
        remaining_amount: newRemainingAmount,
        status: newRemainingAmount <= 0 ? "paid" : "ongoing",
      };
      await updateTransactionStatus(
        transaction.id,
        updatedTransactionData.status
      );

      toast({
        title: "Pembayaran berhasil dicatat.",
        description: `Rp${paymentAmount.toLocaleString(
          "id-ID"
        )} telah ditambahkan ke transaksi.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onPaymentRecorded(); // Beri tahu komponen induk untuk memuat ulang data
      onClose();
    } catch (error) {
      toast({
        title: "Gagal mencatat pembayaran.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Catat Pembayaran untuk {transaction?.description}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Jumlah Pembayaran</FormLabel>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Masukkan jumlah pembayaran"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleRecordPayment}
            isLoading={loading}
          >
            Catat Pembayaran
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RecordPartialPaymentModal;
