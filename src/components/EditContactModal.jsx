// src/components/EditContactModal.jsx

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
import { useAuth } from "../context/AuthContext";
import { updateContact } from "../api/dataApi";

const EditContactModal = ({ isOpen, onClose, contact, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    }
  }, [contact]);

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
      const dataToUpdate = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        user_id: user.id, // <--- Perbaikan: Gunakan user_id
      };

      await updateContact(contact.id, dataToUpdate);

      toast({ title: "Kontak berhasil diperbarui!", status: "success" });
      onClose();
      onUpdateSuccess();
    } catch (err) {
      console.error("Error updating contact:", err);
      toast({ title: "Gagal memperbarui kontak", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Kontak</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {formData && (
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nama</FormLabel>
                <Input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nomor HP</FormLabel>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </FormControl>
            </VStack>
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

export default EditContactModal;
