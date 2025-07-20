import { supabase } from "../config/supabaseClient";

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
  const { data, error } = await supabase.from("transactions").insert([
    {
      ...transactionData,
      user_id: transactionData.user_id,
    },
  ]);
  if (error) throw error;
  return data;
};

export const updateTransaction = async (id, transactionData) => {
  const { data, error } = await supabase
    .from("transactions")
    .update(transactionData)
    .eq("id", id)
    .eq("user_id", transactionData.user_id);
  if (error) throw error;
  return data;
};

export const deleteTransaction = async (transaction_id, user_id) => {
  const { data, error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transaction_id)
    .eq("user_id", user_id);
  if (error) throw error;
  return data;
};

export const updateTransactionStatus = async (
  transaction_id,
  newStatus,
  user_id
) => {
  const { data, error } = await supabase
    .from("transactions")
    .update({ status: newStatus })
    .eq("id", transaction_id)
    .eq("user_id", user_id);
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

export const addPayment = async (paymentData) => {
  const { data, error } = await supabase.from("payments").insert([paymentData]);
  if (error) throw error;
  return data;
};

export const fetchPaymentsByTransactionId = async (transaction_id, user_id) => {
  const { data: transaction, error: transactionError } = await supabase
    .from("transactions")
    .select("id")
    .eq("id", transaction_id)
    .eq("user_id", user_id)
    .single();

  if (transactionError || !transaction) {
    throw new Error("Transaction not found or not owned by the user.");
  }

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("transaction_id", transaction_id);

  if (error) throw error;
  return data;
};

export const fetchPaymentsByUser = async (userId) => {
  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      id,
      amount,
      createdAt,
      transactions (
        id,
        description,
        type,
        user_id
      )
    `
    )
    .eq("transactions.user_id", userId);

  if (error) throw error;

  const payments = data.map((payment) => ({
    id: payment.id,
    amount: payment.amount,
    createdAt: payment.createdAt,
    transactionId: payment.transactions.id,
    transactionDescription: payment.transactions.description,
    transactionType: payment.transactions.type,
  }));

  return payments;
};

export const fetchContactsByUser = async (user_id) => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", user_id);
  if (error) throw error;
  return data;
};

export const fetchContactById = async (contactId, userId) => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", contactId)
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
};

export const addContact = async (contactData) => {
  const { data, error } = await supabase.from("contacts").insert([contactData]);
  if (error) throw error;
  return data;
};

export const updateContact = async (contact_id, updatedData, user_id) => {
  const { data, error } = await supabase
    .from("contacts")
    .update(updatedData)
    .eq("id", contact_id)
    .eq("user_id", user_id);
  if (error) throw error;
  return data;
};

export const deleteContact = async (contact_id, user_id) => {
  const { data, error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", contact_id)
    .eq("user_id", user_id);
  if (error) throw error;
  return data;
};

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

export const updateCategory = async (id, categoryData, user_id) => {
  const { data, error } = await supabase
    .from("categories")
    .update(categoryData)
    .eq("id", id)
    .eq("user_id", user_id);
  if (error) throw error;
  return data;
};

export const deleteCategory = async (category_id, user_id) => {
  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("id", category_id)
    .eq("user_id", user_id);
  if (error) throw error;
  return data;
};
