import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  UserCircleIcon,
  KeyIcon,
  EnvelopeIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

const ProfilePage = () => {
  const { user, changePassword, isLoading: authLoading } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [loadingChangePass, setLoadingChangePass] = useState(false);

  const [userData, setUserData] = useState({
    name: "Memuat...",
    email: "memuat...",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "Nama Pengguna",
        email: user.email || "email@example.com",
      });
    }
  }, [user]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setLoadingChangePass(true);

    if (newPassword !== confirmNewPassword) {
      setPasswordError("Password baru dan konfirmasi password tidak cocok.");
      setLoadingChangePass(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter.");
      setLoadingChangePass(false);
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess("Password berhasil diperbarui!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordError(
        err.message || "Gagal memperbarui password. Silakan coba lagi."
      );
      console.error("Change password error:", err);
    } finally {
      setLoadingChangePass(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-full text-gray-700 dark:text-gray-300">
        Memuat data profil...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
        Profil Pengguna
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-gray-200 flex items-center">
          <UserCircleIcon className="h-7 w-7 mr-3 text-primary-light dark:text-primary-dark" />
          Informasi Dasar
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <IdentificationIcon className="h-4 w-4 inline-block mr-1" />
              Nama
            </label>
            <p className="text-lg text-gray-900 dark:text-gray-100 font-semibold">
              {userData.name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <EnvelopeIcon className="h-4 w-4 inline-block mr-1" />
              Email
            </label>
            <p className="text-lg text-gray-900 dark:text-gray-100 font-semibold">
              {userData.email}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-gray-200 flex items-center">
          <KeyIcon className="h-7 w-7 mr-3 text-primary-light dark:text-primary-dark" />
          Ganti Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-5">
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password Saat Ini
            </label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
                         focus:ring-primary-light focus:border-primary-light
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password Baru
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
                         focus:ring-primary-light focus:border-primary-light
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-new-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              id="confirm-new-password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
                         focus:ring-primary-light focus:border-primary-light
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {passwordError && (
            <p className="text-red-500 text-sm text-center">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-green-500 text-sm text-center">
              {passwordSuccess}
            </p>
          )}

          <button
            type="submit"
            disabled={loadingChangePass || authLoading}
            className={`w-full px-4 py-2 rounded-md text-white font-semibold
                       ${
                         loadingChangePass || authLoading
                           ? "bg-primary-light opacity-70 cursor-not-allowed"
                           : "bg-primary-light hover:bg-primary-dark"
                       }
                       dark:bg-primary-dark dark:hover:bg-secondary-dark
                       shadow-md hover:shadow-lg
                       transition-all duration-200`}
          >
            {loadingChangePass || authLoading
              ? "Memperbarui..."
              : "Perbarui Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
