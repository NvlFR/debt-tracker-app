// src/components/AddDebtModal.jsx

import React, { useState } from "react";
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
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../../../../context/AuthContext";
import { addTransaction } from "../../../../api/dataApi";

const AddDebtModal = ({
  isOpen,
  onClose,
  onAddSuccess,
  contacts,
  categories,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    contactId: "",
    categoryId: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (
        !formData.amount ||
        !formData.description ||
        !formData.contactId ||
        !formData.categoryId
      ) {
        toast({ title: "Semua bidang wajib diisi.", status: "warning" });
        setLoading(false);
        return;
      }

      const transactionData = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        contactId: formData.contactId,
        categoryId: formData.categoryId,
        dueDate: formData.dueDate,
        type: "utang",
        status: "ongoing",
        currentAmount: parseFloat(formData.amount),
        user_id: user.id, // <--- Perbaikan di sini
      };

      await addTransaction(transactionData);

      toast({ title: "Utang berhasil ditambahkan!", status: "success" });
      onClose();
      onAddSuccess();
      setFormData({
        amount: "",
        description: "",
        contactId: "",
        categoryId: "",
        dueDate: "",
      });
    } catch (err) {
      console.error("Error adding debt:", err);
      toast({
        title: "Gagal menambahkan utang",
        description: err.message,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tambah Utang Baru</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Jumlah</FormLabel>
              <Input
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Deskripsi</FormLabel>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Pihak Terkait</FormLabel>
              <Select
                name="contactId"
                placeholder="Pilih Pihak"
                value={formData.contactId}
                onChange={handleChange}
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
                name="categoryId"
                placeholder="Pilih Kategori"
                value={formData.categoryId}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Tanggal Jatuh Tempo</FormLabel>
              <Input
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
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

export default AddDebtModal;
