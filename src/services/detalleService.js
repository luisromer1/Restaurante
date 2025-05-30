// src/services/detalleService.js
import axios from 'axios';

const API_URL = 'https://localhost:7248/api/Detalle'; // ¡VERIFICA QUE EL PUERTO SEA EL CORRECTO!

const detalleService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/Listar`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la lista de detalles:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Listar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener detalle con ID ${id}:`, error);
      throw error;
    }
  },

  create: async (detalleData) => {
    try {
      const response = await axios.post(`${API_URL}/Insertar`, detalleData);
      return response.data;
    } catch (error) {
      console.error('Error al crear detalle:', error);
      throw error;
    }
  },

  update: async (id, detalleData) => {
    try {
      const response = await axios.put(`${API_URL}/Actualizar/${id}`, detalleData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar detalle con ID ${id}:`, error);
      throw error;
    }
  },

  remove: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/Eliminar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar detalle con ID ${id}:`, error);
      throw error;
    }
  },
};

export default detalleService;