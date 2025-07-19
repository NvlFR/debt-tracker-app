const API_URL = "http://localhost:3001";

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/users?email=${email}`);
  const users = await response.json();

  if (users.length > 0) {
    const user = users[0];
    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  return { success: false, message: "Email atau Password salah" };
};

export const registerUser = async (name, email, password) => {
  const checkEmail = await fetch(`${API_URL}/users?email=${email}`);
  const existingUser = await checkEmail.json();
  if (existingUser.length > 0) {
    return { success: false, message: "Email sudah terdaftar." };
  }

  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (response.ok) {
    const newUser = await response.json();
    return {
      success: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    };
  } else {
    return { success: false, message: "Terjadi kesalahan saat registrasi." };
  }
};
