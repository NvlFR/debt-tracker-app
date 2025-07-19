// src/api/dataApi.js
import { supabase } from "../config/supabaseClient";

// --- USERS ---
export const fetchUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (error) throw error;
  return data;
};

export const registerUser = async (userData) => {
  const { data, error } = await supabase.from("users").insert([userData]);
  if (error) throw error;
  return data;
};

// --- TRANSACTIONS ---
export const fetchTransactionsByType = async (user_id, type) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, contact:contacts(name), category:categories(name)")
    .eq("user_id", user_id)
    .eq("type", type);
  if (error) throw error;
  return data;
};

export const addTransaction = async (transactionData) => {
  const { data, error } = await supabase
    .from("transactions")
    .insert([transactionData]);
  if (error) throw error;
  return data;
};

export const updateTransaction = async (transaction_id, updatedData) => {
  const { data, error } = await supabase
    .from("transactions")
    .update(updatedData)
    .eq("id", transaction_id);
  if (error) throw error;
  return data;
};

export const deleteTransaction = async (transaction_id) => {
  const { data, error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transaction_id);
  if (error) throw error;
  return data;
};

export const updateTransactionStatus = async (transaction_id, newStatus) => {
  const { data, error } = await supabase
    .from("transactions")
    .update({ status: newStatus })
    .eq("id", transaction_id);
  if (error) throw error;
  return data;
};

export const fetchTransactionsByUser = async (user_id) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, contact:contacts(name), category:categories(name)")
    .eq("user_id", user_id);
  if (error) throw error;
  return data;
};

export const fetchTransactionsByContact = async (user_id, contact_id) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, contact:contacts(name), category:categories(name)")
    .eq("user_id", user_id)
    .eq("contact_id", contact_id);
  if (error) throw error;
  return data;
};

// --- PAYMENTS ---
export const addPayment = async (paymentData) => {
  const { data, error } = await supabase.from("payments").insert([paymentData]);
  if (error) throw error;
  return data;
};

export const fetchPaymentsByTransactionId = async (transaction_id) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("transaction_id", transaction_id);
  if (error) throw error;
  return data;
};

export const fetchPaymentsByUser = async (user_id) => {
  // Supabase tidak mendukung join di sisi klien, jadi kita ambil transaksi dulu
  const { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select("id")
    .eq("user_id", user_id);
  if (transactionsError) throw transactionsError;

  const transactionIds = transactions.map((t) => t.id);

  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select("*")
    .in("transaction_id", transactionIds);
  if (paymentsError) throw paymentsError;

  return payments;
};

// --- CONTACTS ---
export const fetchContactsByUser = async (user_id) => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", user_id);
  if (error) throw error;
  return data;
};

export const fetchContactById = async (contact_id) => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", contact_id)
    .single();
  if (error) throw error;
  return data;
};

export const addContact = async (contactData) => {
  const { data, error } = await supabase.from("contacts").insert([contactData]);
  if (error) throw error;
  return data;
};

export const updateContact = async (contact_id, updatedData) => {
  const { data, error } = await supabase
    .from("contacts")
    .update(updatedData)
    .eq("id", contact_id);
  if (error) throw error;
  return data;
};

export const deleteContact = async (contact_id) => {
  const { data, error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", contact_id);
  if (error) throw error;
  return data;
};

// --- CATEGORIES ---
export const fetchCategoriesByUser = async (user_id) => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user_id);
  if (error) throw error;
  return data;
};

export const addCategory = async (categoryData) => {
  const { data, error } = await supabase
    .from("categories")
    .insert([categoryData]);
  if (error) throw error;
  return data;
};

export const updateCategory = async (id, categoryData) => {
  const { data, error } = await supabase
    .from("categories")
    .update(categoryData)
    .eq("id", id)
    .eq("user_id", categoryData.user_id); // Pastikan ini juga menggunakan user_id

  if (error) throw error;
  return data;
};

export const deleteCategory = async (category_id) => {
  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("id", category_id);
  if (error) throw error;
  return data;
};
