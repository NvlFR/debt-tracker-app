// src/pages/PartiesPage.jsx
import React, { useState, useEffect } from "react";
import partiesService from "../services/partiesService";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PartyForm from "../components/forms/PartyForm"; // ✅ perbaiki path ini
import { toast } from "react-toastify";

const PartiesPage = () => {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);

  // Ambil daftar pihak
  const fetchParties = async () => {
    try {
      setLoading(true);
      const data = await partiesService.getAllParties();
      setParties(data || []); // ✅ pastikan array tidak undefined
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal memuat daftar pihak.");
      toast.error("Gagal memuat pihak.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  const handleAddParty = () => {
    setSelectedParty(null);
    setIsModalOpen(true);
  };

  const handleEditParty = (party) => {
    setSelectedParty(party);
    setIsModalOpen(true);
  };

  const handleDeleteParty = async (id) => {
    const confirm = window.confirm(
      "Apakah Anda yakin ingin menghapus pihak ini?"
    );
    if (!confirm) return;

    try {
      await partiesService.deleteParty(id);
      toast.success("Pihak berhasil dihapus!");
      fetchParties();
    } catch (err) {
      toast.error("Gagal menghapus pihak.");
      console.error("Delete error:", err);
    }
  };

  const handleFormSuccess = () => {
    fetchParties();
    setIsModalOpen(false);
    setSelectedParty(null);
  };

  const handleFormCancel = () => {
    setIsModalOpen(false);
    setSelectedParty(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Daftar Pihak</h1>

      <button
        onClick={handleAddParty}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md mb-6 transition transform hover:scale-105"
      >
        + Tambah Pihak Baru
      </button>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : parties.length === 0 ? (
        <p className="text-gray-600 text-center">
          Belum ada pihak yang terdaftar.
        </p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100 border-b text-sm text-gray-600 uppercase font-semibold">
                <th className="px-5 py-3">Nama Pihak</th>
                <th className="px-5 py-3">No. Telepon</th>
                <th className="px-5 py-3">Jenis</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {parties.map((party) => (
                <tr
                  key={party.id}
                  className="border-b hover:bg-gray-50 text-sm text-gray-800"
                >
                  <td className="px-5 py-4">{party.name}</td>
                  <td className="px-5 py-4">{party.phone || "-"}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                        party.type === "both"
                          ? "bg-indigo-100 text-indigo-800"
                          : party.type === "debtor"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {party.type === "both"
                        ? "Keduanya"
                        : party.type === "debtor"
                        ? "Berhutang"
                        : "Berpiutang"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleEditParty(party)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteParty(party.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={selectedParty ? "Edit Pihak" : "Tambah Pihak Baru"}
      >
        <PartyForm
          partyToEdit={selectedParty}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>
    </div>
  );
};

export default PartiesPage;
