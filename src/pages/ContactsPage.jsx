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
  List,
  ListItem,
  Flex,
  Spacer,
  useDisclosure,
  IconButton,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchContactsByUser, deleteContact } from "../api/dataApi";
import AddContactModal from "../components/modal/contactModal/components/AddContactModal";
import EditContactModal from "../components/modal/contactModal/components/EditContactModal";

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
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchData = async () => {
    try {
      if (!user) return;
      const contactData = await fetchContactsByUser(user.id);
      setContacts(contactData);
    } catch (err) {
      console.error("Error fetching contacts:", err);
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

  const handleEditClick = (contact) => {
    setSelectedContact(contact);
    onEditOpen();
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await deleteContact(contactId);
      fetchData();
    } catch (err) {
      console.error("Error deleting contact:", err);
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
                <LinkBox
                  as={ListItem}
                  key={contact.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  _hover={{ bg: "gray.700" }}
                >
                  <Flex alignItems="center">
                    <Box>
                      <LinkOverlay as={Link} to={`/contacts/${contact.id}`}>
                        <Text fontWeight="bold">{contact.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {contact.email}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {contact.phone}
                        </Text>
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

      {/* Gunakan modal yang sudah kita buat */}
      <AddContactModal
        isOpen={isOpen}
        onClose={onClose}
        onAddSuccess={fetchData}
      />

      <EditContactModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        contact={selectedContact}
        onUpdateSuccess={fetchData}
      />
    </Box>
  );
};

export default ContactsPage;
