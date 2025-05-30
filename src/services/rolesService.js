// src/services/rolesService.js
import axios from 'axios';

const API_URL = 'https://localhost:7248/api/Roles'; // ¡VERIFICA QUE EL PUERTO SEA EL CORRECTO!

const rolesService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/Listar`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la lista de roles:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Listar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener rol con ID ${id}:`, error);
      throw error;
    }
  },

  create: async (rolData) => {
    try {
      const response = await axios.post(`${API_URL}/Insertar`, rolData);
      return response.data;
    } catch (error) {
      console.error('Error al crear rol:', error);
      throw error;
    }
  },

  update: async (id, rolData) => {
    try {
      const response = await axios.put(`${API_URL}/Actualizar/${id}`, rolData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar rol con ID ${id}:`, error);
      throw error;
    }
  },

  remove: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/Eliminar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar rol con ID ${id}:`, error);
      throw error;
    }
  },
};

export default rolesService;