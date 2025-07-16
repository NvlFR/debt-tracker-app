// src/services/partiesService.js
// Mengimpor instance Axios dari file api.js di folder yang sama
import api from "./api"; // <--- Path relatif yang benar

const partiesService = {
  getAllParties: async (params = {}) => {
    try {
      const response = await api.get("/parties", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching all parties:", error);
      throw error;
    }
  },

  getPartyById: async (id) => {
    try {
      const response = await api.get(`/parties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching party with ID ${id}:`, error);
      throw error;
    }
  },

  createParty: async (partyData) => {
    try {
      const newParty = {
        ...partyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const response = await api.post("/parties", newParty);
      return response.data;
    } catch (error) {
      console.error("Error creating party:", error);
      throw error;
    }
  },

  updateParty: async (id, updatedData) => {
    try {
      const partyToUpdate = {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };
      const response = await api.put(`/parties/${id}`, partyToUpdate);
      return response.data;
    } catch (error) {
      console.error(`Error updating party with ID ${id}:`, error);
      throw error;
    }
  },

  deleteParty: async (id) => {
    try {
      await api.delete(`/parties/${id}`);
    } catch (error) {
      console.error(`Error deleting party with ID ${id}:`, error);
      throw error;
    }
  },
};

export default partiesService;
