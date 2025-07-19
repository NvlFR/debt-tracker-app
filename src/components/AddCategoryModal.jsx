// src/components/AddCategoryModal.jsx

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
  VStack,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook

const AddCategoryModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user } = useAuth(); // Dapatkan user dari AuthContext

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

    const { error: insertError } = await supabase.from("categories").insert({
      name: formData.name,
      user_id: user.id, // <--- Tambahkan user_id di sini
    });

    if (insertError) {
      console.error(insertError);
      toast({ title: "Gagal menambahkan kategori", status: "error" });
    } else {
      toast({ title: "Kategori berhasil ditambahkan!", status: "success" });
      onClose();
      setFormData({ name: "" }); // Reset form
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tambah Kategori Baru</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nama Kategori</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>
          </VStack>
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

export default AddCategoryModal;
