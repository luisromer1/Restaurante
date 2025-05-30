// src/services/entregasService.js
import axios from 'axios';

const API_URL = 'https://localhost:7248/api/Entregas'; // ¡VERIFICA QUE EL PUERTO SEA EL CORRECTO!

const entregasService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/Listar`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la lista de entregas:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Listar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener entrega con ID ${id}:`, error);
      throw error;
    }
  },

  create: async (entregaData) => {
    try {
      const response = await axios.post(`${API_URL}/Insertar`, entregaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear entrega:', error);
      throw error;
    }
  },

  update: async (id, entregaData) => {
    try {
      const response = await axios.put(`${API_URL}/Actualizar/${id}`, entregaData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar entrega con ID ${id}:`, error);
      throw error;
    }
  },

  remove: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/Eliminar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar entrega con ID ${id}:`, error);
      throw error;
    }
  },
};

export default entregasService;