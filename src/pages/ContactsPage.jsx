import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  List,
  ListItem,
  Flex,
  Spacer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Stack,
  IconButton,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate, Link } from "react-router-dom"; // Import Link di sini
import { useAuth } from "../context/AuthContext";
import {
  fetchContactsByUser,
  addContact,
  updateContact,
  deleteContact,
} from "../api/dataApi";
import Navbar from "../components/layout/Navbar";

const ContactsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchData = async () => {
    try {
      const contactData = await fetchContactsByUser(user.id);
      setContacts(contactData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const handleAddContact = async () => {
    try {
      await addContact({ ...newContact, userId: user.id });
      fetchData();
      onClose();
      setNewContact({ name: "", email: "", phone: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (contact) => {
    setSelectedContact(contact);
    onEditOpen();
  };

  const handleUpdateContact = async () => {
    try {
      await updateContact(selectedContact.id, selectedContact);
      fetchData();
      onEditClose();
      setSelectedContact(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await deleteContact(contactId);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Alert status="error" maxW="md">
          <AlertIcon />
          {error}
        </Alert>
      </Center>
    );
  }

  return (
    <Box>
      <Navbar />
      <Box p={8}>
        <Flex mb={6} alignItems="center">
          <Heading>Daftar Pihak Terkait</Heading>
          <Spacer />
          <Button colorScheme="teal" onClick={onOpen} leftIcon={<AddIcon />}>
            Tambah Kontak Baru
          </Button>
        </Flex>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>
            Daftar Kontak
          </Heading>
          {contacts.length === 0 ? (
            <Text>Tidak ada kontak yang terdaftar.</Text>
          ) : (
            <List spacing={3}>
              {contacts.map((contact) => (
                <LinkBox as={ListItem} key={contact.id} p={3} borderWidth="1px" borderRadius="md" _hover={{ bg: "gray.700" }}>
                  <Flex alignItems="center">
                    <Box>
                      {/* Perubahan di sini: Menggunakan "as={Link}" dan "to" */}
                      <LinkOverlay as={Link} to={`/contacts/${contact.id}`}>
                        <Text fontWeight="bold">{contact.name}</Text>
                        <Text fontSize="sm" color="gray.500">{contact.email}</Text>
                        <Text fontSize="sm" color="gray.500">{contact.phone}</Text>
                      </LinkOverlay>
                    </Box>
                    <Spacer />
                    <Flex>
                      <IconButton
                        icon={<EditIcon />}
                        mr={2}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(contact);
                        }}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteContact(contact.id);
                        }}
                      />
                    </Flex>
                  </Flex>
                </LinkBox>
              ))}
            </List>
          )}
        </Box>
      </Box>

      {/* Modal untuk Tambah Kontak */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Kontak Baru</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nama</FormLabel>
                <Input
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nomor HP</FormLabel>
                <Input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddContact}>
              Simpan
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal untuk Edit Kontak */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Kontak</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedContact && (
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nama</FormLabel>
                  <Input
                    value={selectedContact.name}
                    onChange={(e) =>
                      setSelectedContact({
                        ...selectedContact,
                        name: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={selectedContact.email}
                    onChange={(e) =>
                      setSelectedContact({
                        ...selectedContact,
                        email: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Nomor HP</FormLabel>
                  <Input
                    type="tel"
                    value={selectedContact.phone}
                    onChange={(e) =>
                      setSelectedContact({
                        ...selectedContact,
                        phone: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleUpdateContact}>
              Simpan Perubahan
            </Button>
            <Button variant="ghost" onClick={onEditClose}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ContactsPage;