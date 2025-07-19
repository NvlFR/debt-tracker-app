// src/components/AddCreditModal.jsx

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
import { useAuth } from "../context/AuthContext";

const AddCreditModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ contact_name: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { contact_name, amount } = formData;

    if (!user) {
      toast({ title: "User tidak terautentikasi.", status: "error" });
      setLoading(false);
      return;
    }

    let contact_id = null;
    const { data: contactData, error: contactError } = await supabase
      .from("contacts")
      .select("id")
      .eq("name", contact_name)
      .eq("user_id", user.id) // Tambahkan filter user_id
      .single();

    if (contactError && contactError.code !== "PGRST116") {
      console.error("Error fetching contact:", contactError);
    } else {
      contact_id = contactData?.id;
    }

    if (!contact_id) {
      // Jika kontak tidak ditemukan, buat kontak baru
      const { data: newContact, error: newContactError } = await supabase
        .from("contacts")
        .insert([
          {
            name: contact_name,
            user_id: user.id, // <--- Tambahkan user_id di sini
          },
        ])
        .select()
        .single();

      if (newContactError) {
        console.error("Error creating new contact:", newContactError);
        toast({ title: "Gagal membuat kontak baru", status: "error" });
        setLoading(false);
        return;
      }
      contact_id = newContact.id;
    }

    const { error: insertError } = await supabase.from("transactions").insert({
      contact_id: contact_id,
      amount: parseFloat(amount),
      current_amount: parseFloat(amount),
      type: "Piutang",
      status: "ongoing",
      user_id: user.id, // <--- Tambahkan user_id di sini juga
    });

    if (insertError) {
      console.error(insertError);
      toast({ title: "Gagal menambahkan piutang", status: "error" });
    } else {
      toast({ title: "Piutang berhasil ditambahkan!", status: "success" });
      onClose();
    }
    setLoading(false);
  };

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setFormData({ contact_name: "", amount: "" });
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tambah Piutang Baru</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nama Kontak</FormLabel>
              <Input
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Jumlah</FormLabel>
              <Input
                name="amount"
                type="number"
                value={formData.amount}
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

export default AddCreditModal;
