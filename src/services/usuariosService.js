// src/services/usuariosService.js
import axios from 'axios';

const API_URL = 'https://localhost:7248/api/Usuarios'; // ¡VERIFICA QUE EL PUERTO SEA EL CORRECTO!

const usuariosService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/Listar`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Listar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      throw error;
    }
  },

  create: async (usuarioData) => {
    try {
      const response = await axios.post(`${API_URL}/Insertar`, usuarioData);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  update: async (id, usuarioData) => {
    try {
      const response = await axios.put(`${API_URL}/Actualizar/${id}`, usuarioData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw error;
    }
  },

  remove: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/Eliminar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw error;
    }
  },
};

export default usuariosService;