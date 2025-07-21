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

export async function addTransaction(transactionData) {
  try {
    const { data, error } = await supabase
      .from("transactions") // atau nama tabel Anda, misalnya 'piutang'
      .insert([
        {
          amount: transactionData.amount,
          current_amount: transactionData.currentAmount,
          description: transactionData.description,
          type: transactionData.type,
          status: transactionData.status,
          due_date: transactionData.dueDate,
          contact_id: transactionData.contactId, // <-- PERBAIKAN DI SINI
          category_id: transactionData.categoryId, // <-- PERBAIKAN DI SINI
          user_id: transactionData.userId, // <-- PERBAIKAN DI SINI
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error adding transaction:", error.message);
    throw error;
  }
}

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

export async function addContact(contactData) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("User not authenticated.");
    }

    // Perbaikan utama: memetakan 'phone' ke 'phone_number'
    const dataToInsert = {
      name: contactData.name,
      email: contactData.email,
      phone_number: contactData.phone,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("contacts")
      .insert([dataToInsert])
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error("Error adding contact:", error.message);
    throw error;
  }
}

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
