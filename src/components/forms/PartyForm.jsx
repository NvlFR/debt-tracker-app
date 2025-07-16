// src/components/forms/PartyForm.jsx
import React, { useState, useEffect } from "react";
import partiesService from "../../services/partiesService";
import { toast } from "react-toastify";

const PartyForm = ({ partyToEdit, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "both",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (partyToEdit) {
      setFormData({
        name: partyToEdit.name || "",
        phone: partyToEdit.phone || "",
        type: partyToEdit.type || "both",
      });
    } else {
      setFormData({ name: "", phone: "", type: "both" });
    }
    setErrors({});
  }, [partyToEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Nama pihak wajib diisi.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim() === "" ? null : formData.phone.trim(),
        type: formData.type,
      };

      if (partyToEdit) {
        await partiesService.updateParty(partyToEdit.id, payload);
        toast.success("Pihak berhasil diperbarui!");
      } else {
        await partiesService.createParty(payload);
        toast.success("Pihak berhasil ditambahkan!");
      }
      onSuccess();
    } catch (err) {
      const fallbackMessage = partyToEdit
        ? "Gagal memperbarui pihak!"
        : "Gagal menambahkan pihak!";
      toast.error(fallbackMessage);
      console.error(fallbackMessage, err);
      setErrors({
        form: err?.response?.data?.message || fallbackMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {/* Nama Pihak */}
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-bold mb-2 text-gray-700"
        >
          Nama Pihak <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            errors.name ? "border-red-500" : ""
          }`}
          placeholder="Nama Pihak"
          disabled={loading}
        />
        {errors.name && (
          <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
        )}
      </div>

      {/* Nomor Telepon */}
      <div className="mb-4">
        <label
          htmlFor="phone"
          className="block text-sm font-bold mb-2 text-gray-700"
        >
          Nomor Telepon (Opsional)
        </label>
        <input
          type="text"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Contoh: 08123456789"
          disabled={loading}
        />
      </div>

      {/* Jenis Pihak */}
      <div className="mb-6">
        <label
          htmlFor="type"
          className="block text-sm font-bold mb-2 text-gray-700"
        >
          Jenis Pihak
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={handleChange}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          <option value="both">
            Keduanya (Pemberi Utang & Penerima Piutang)
          </option>
          <option value="debtor">
            Pihak Berhutang (Anda punya piutang ke dia)
          </option>
          <option value="creditor">
            Pihak Berpiutang (Anda punya utang ke dia)
          </option>
        </select>
      </div>

      {/* Error Umum */}
      {errors.form && (
        <p className="text-red-500 text-xs italic mb-4">{errors.form}</p>
      )}

      {/* Tombol Aksi */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
          disabled={loading}
        >
          Batal
        </button>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          disabled={loading}
        >
          {loading
            ? "Menyimpan..."
            : partyToEdit
            ? "Perbarui Pihak"
            : "Tambah Pihak"}
        </button>
      </div>
    </form>
  );
};

export default PartyForm;
