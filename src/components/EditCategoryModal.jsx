// src/components/EditCategoryModal.jsx

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
  Stack,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { updateCategory } from "../api/dataApi"; // Pastikan fungsi ini ada

const EditCategoryModal = ({ isOpen, onClose, category, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  // Mengisi form dengan data kategori yang dipilih saat modal dibuka
  useEffect(() => {
    if (category) {
      setFormData(category);
    }
  }, [category]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!user) {
      toast({ title: "User tidak terautentikasi.", status: "error" });
      setLoading(false);
      return;
    }

    try {
      // Perbaiki: Pastikan data yang dikirim tidak mengandung `userId`
      const dataToUpdate = {
        name: formData.name,
        user_id: user.id, // Menambahkan user_id
      };

      await updateCategory(category.id, dataToUpdate);

      toast({ title: "Kategori berhasil diperbarui!", status: "success" });
      onClose();
      onUpdateSuccess(); // Panggil callback untuk me-refresh data di halaman utama
    } catch (err) {
      console.error("Error updating category:", err);
      toast({ title: "Gagal memperbarui kategori", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Kategori</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {formData && (
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nama Kategori</FormLabel>
                <Input
                  name="name"
                  value={formData.name || ""}
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

export default EditCategoryModal;
