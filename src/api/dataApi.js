const API_URL = "http://localhost:3001";

// Fungsi untuk Transaksi
export const fetchTransactionsByUser = async (userId) => {
  const response = await fetch(
    `${API_URL}/transactions?userId=${userId}&_expand=contact&_expand=category`
  );
  if (!response.ok) {
    throw new Error("Gagal mengambil data transaksi.");
  }
  return response.json();
};

export const fetchTransactionsByType = async (userId, type) => {
  const response = await fetch(
    `${API_URL}/transactions?userId=${userId}&type=${type}&_expand=contact&_expand=category`
  );
  if (!response.ok) {
    throw new Error("Gagal mengambil data transaksi.");
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
    throw new Error("Gagal menambahkan transaksi.");
  }
  return response.json();
};

export const updateTransaction = async (id, transactionData) => {
  const response = await fetch(`${API_URL}/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) {
    throw new Error("Gagal memperbarui transaksi.");
  }
  return response.json();
};

export const deleteTransaction = async (id) => {
  const response = await fetch(`${API_URL}/transactions/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Gagal menghapus transaksi.");
  }
  return response.json();
};

// Fungsi untuk Kontak
export const fetchContactsByUser = async (userId) => {
  const response = await fetch(`${API_URL}/contacts?userId=${userId}`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data kontak.");
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
    throw new Error("Gagal menambahkan kontak.");
  }
  return response.json();
};

export const updateContact = async (id, contactData) => {
  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });
  if (!response.ok) {
    throw new Error("Gagal memperbarui kontak.");
  }
  return response.json();
};

export const deleteContact = async (id) => {
  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Gagal menghapus kontak.");
  }
  return response.json();
};

// Fungsi untuk Kategori
export const fetchCategoriesByUser = async (userId) => {
  const response = await fetch(`${API_URL}/categories?userId=${userId}`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data kategori.");
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
    throw new Error("Gagal menambahkan kategori.");
  }
  return response.json();
};

export const updateCategory = async (id, categoryData) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    throw new Error("Gagal memperbarui kategori.");
  }
  return response.json();
};

export const deleteCategory = async (id) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Gagal menghapus kategori.");
  }
  return response.json();
};
