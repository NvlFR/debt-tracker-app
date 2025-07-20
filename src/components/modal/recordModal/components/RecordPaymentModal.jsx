// src/components/RecordPaymentModal.jsx

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { supabase } from "../../../../config/supabaseClient";
import { useAuth } from "../../../../context/AuthContext"; // Import useAuth hook

const RecordPaymentModal = ({ isOpen, onClose }) => {
  const [outstandingCredits, setOutstandingCredits] = useState([]);
  const [formData, setFormData] = useState({ transaction_id: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const toast = useToast();
  const { user } = useAuth(); // Dapatkan user dari AuthContext

  useEffect(() => {
    if (isOpen && user) {
      // Pastikan user sudah ada sebelum fetch
      const fetchCredits = async () => {
        setInitialLoading(true);
        const { data, error } = await supabase
          .from("transactions")
          .select("id, amount, current_amount, contacts(name)")
          .eq("type", "Piutang")
          .eq("user_id", user.id) // <--- Tambahkan filter user_id di sini
          .neq("status", "Lunas");

        if (error) {
          console.error("Error fetching outstanding credits:", error);
        } else {
          setOutstandingCredits(data);
        }
        setInitialLoading(false);
      };
      fetchCredits();
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { transaction_id, amount } = formData;

    if (!user) {
      toast({ title: "User tidak terautentikasi.", status: "error" });
      setLoading(false);
      return;
    }

    const transactionToUpdate = outstandingCredits.find(
      (tx) => tx.id.toString() === transaction_id
    );
    if (!transactionToUpdate) {
      toast({ title: "Transaksi tidak ditemukan", status: "error" });
      setLoading(false);
      return;
    }

    const paidAmount = parseFloat(amount);
    const newCurrentAmount = transactionToUpdate.current_amount - paidAmount;
    let newStatus = newCurrentAmount <= 0 ? "Lunas" : "ongoing";

    // Update transaksi di tabel 'transactions'
    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        current_amount: newCurrentAmount,
        status: newStatus,
      })
      .eq("id", transaction_id);

    if (updateError) {
      console.error(updateError);
      toast({ title: "Gagal mencatat pembayaran", status: "error" });
    } else {
      // Masukkan record pembayaran ke tabel 'payments'
      const { error: paymentError } = await supabase.from("payments").insert({
        transaction_id: transaction_id,
        amount: paidAmount,
        user_id: user.id, // <--- Tambahkan user_id di sini
      });

      if (paymentError) {
        console.error(paymentError);
        toast({
          title: "Pembayaran berhasil, tetapi gagal mencatat di riwayat.",
          status: "warning",
        });
      } else {
        toast({ title: "Pembayaran berhasil dicatat!", status: "success" });
      }
      onClose();
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Catat Pembayaran</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {initialLoading ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Pilih Piutang</FormLabel>
                <Select
                  name="transaction_id"
                  value={formData.transaction_id}
                  onChange={handleChange}
                  placeholder="Pilih Piutang..."
                >
                  {outstandingCredits.map((credit) => (
                    <option key={credit.id} value={credit.id}>
                      {credit.contacts?.name} - Sisa Rp{" "}
                      {credit.current_amount.toLocaleString("id-ID")}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Jumlah Pembayaran</FormLabel>
                <Input
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  isDisabled={!formData.transaction_id}
                />
              </FormControl>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Simpan
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RecordPaymentModal;
