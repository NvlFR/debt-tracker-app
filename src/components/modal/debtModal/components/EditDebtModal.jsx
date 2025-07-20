// src/components/EditDebtModal.jsx

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
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../../../../context/AuthContext";
import { updateTransaction } from "../../../../api/dataApi";

const EditDebtModal = ({
  isOpen,
  onClose,
  transaction,
  onUpdateSuccess,
  contacts,
  categories,
}) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount || "",
        description: transaction.description || "",
        contactId: transaction.contactId || "",
        categoryId: transaction.categoryId || "",
        dueDate: transaction.dueDate || "",
        id: transaction.id,
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const dataToUpdate = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        contactId: formData.contactId,
        categoryId: formData.categoryId,
        dueDate: formData.dueDate,
        user_id: user.id, // <--- Perbaikan di sini
      };

      await updateTransaction(formData.id, dataToUpdate);

      toast({ title: "Utang berhasil diperbarui!", status: "success" });
      onClose();
      onUpdateSuccess();
    } catch (err) {
      console.error("Error updating debt:", err);
      toast({
        title: "Gagal memperbarui utang",
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
        <ModalHeader>Edit Utang</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {formData.id && (
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
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Simpan Perubahan
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditDebtModal;
