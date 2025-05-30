// src/services/productosService.js
import axios from 'axios';

const API_URL = 'https://localhost:7248/api/Productos'; // Asegúrate de que esta URL sea la correcta para tu backend

const productosService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/Listar`);
      return response.data;
    } catch (error) {
      console.error('Error fetching productos:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Listar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching producto with ID ${id}:`, error);
      throw error;
    }
  },

  create: async (productoData) => {
    try {
      const response = await axios.post(`${API_URL}/Insertar`, productoData);
      return response.data;
    } catch (error) {
      console.error('Error creating producto:', error);
      throw error;
    }
  },

  update: async (id, productoData) => {
    try {
      const response = await axios.put(`${API_URL}/Actualizar/${id}`, productoData);
      return response.data;
    } catch (error) {
      console.error(`Error updating producto with ID ${id}:`, error);
      throw error;
    }
  },

  remove: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/Eliminar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting producto with ID ${id}:`, error);
      throw error;
    }
  },
};

export default productosService;