const API_URL = "http://localhost:3001";

// --- USERS ---
export const fetchUserByEmail = async (email) => {
  const response = await fetch(`${API_URL}/users?email=${email}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user data.");
  }
  const users = await response.json();
  return users[0];
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error("Failed to register user.");
  }
  return response.json();
};


// --- TRANSACTIONS ---
export const fetchTransactionsByType = async (userId, type) => {
  const response = await fetch(
    `${API_URL}/transactions?userId=${userId}&type=${type}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} transactions.`);
  }
  return response.json();
};

export const addTransaction = async (transactionData) => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) {
    throw new Error("Failed to add transaction.");
  }
  return response.json();
};

export const updateTransaction = async (transactionId, updatedData) => {
  const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error("Failed to update transaction.");
  }
  return response.json();
};

export const deleteTransaction = async (transactionId) => {
  const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete transaction.");
  }
  return response.json();
};

export const updateTransactionStatus = async (transactionId, newStatus) => {
  const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  });
  if (!response.ok) {
    throw new Error("Failed to update transaction status.");
  }
  return response.json();
};

export const fetchTransactionsByUser = async (userId) => {
  const response = await fetch(`${API_URL}/transactions?userId=${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user's transactions.");
  }
  return response.json();
};

// Fungsi baru untuk mengambil semua transaksi berdasarkan ID kontak
export const fetchTransactionsByContact = async (userId, contactId) => {
  const response = await fetch(
    `${API_URL}/transactions?userId=${userId}&contactId=${contactId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch transactions by contact.");
  }
  return response.json();
};

// --- PAYMENTS ---
export const addPayment = async (paymentData) => {
  const response = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });
  if (!response.ok) {
    throw new Error("Failed to add payment.");
  }
  return response.json();
};

export const fetchPaymentsByTransactionId = async (transactionId) => {
  const response = await fetch(
    `${API_URL}/payments?transactionId=${transactionId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch payments for transaction.");
  }
  return response.json();
};

export const fetchPaymentsByUser = async (userId) => {
  const transactions = await fetchTransactionsByUser(userId);
  const transactionIds = transactions.map((t) => t.id);

  const response = await fetch(`${API_URL}/payments`);
  if (!response.ok) {
    throw new Error("Failed to fetch all payments.");
  }
  const allPayments = await response.json();

  return allPayments.filter((payment) =>
    transactionIds.includes(payment.transactionId)
  );
};

// --- CONTACTS ---
export const fetchContactsByUser = async (userId) => {
  const response = await fetch(`${API_URL}/contacts?userId=${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch contacts.");
  }
  return response.json();
};

export const fetchContactById = async (contactId) => {
  const response = await fetch(`${API_URL}/contacts/${contactId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch contact by ID.");
  }
  return response.json();
};

export const addContact = async (contactData) => {
  const response = await fetch(`${API_URL}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });
  if (!response.ok) {
    throw new Error("Failed to add contact.");
  }
  return response.json();
};

export const updateContact = async (contactId, updatedData) => {
  const response = await fetch(`${API_URL}/contacts/${contactId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error("Failed to update contact.");
  }
  return response.json();
};

export const deleteContact = async (contactId) => {
  const response = await fetch(`${API_URL}/contacts/${contactId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete contact.");
  }
  return response.json();
};

// --- CATEGORIES ---
export const fetchCategoriesByUser = async (userId) => {
  const response = await fetch(`${API_URL}/categories?userId=${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories.");
  }
  return response.json();
};

export const addCategory = async (categoryData) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    throw new Error("Failed to add category.");
  }
  return response.json();
};

export const updateCategory = async (categoryId, updatedData) => {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error("Failed to update category.");
  }
  return response.json();
};

export const deleteCategory = async (categoryId) => {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete category.");
  }
  return response.json();
};