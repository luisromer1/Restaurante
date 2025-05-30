// src/services/pedidosService.js
import axios from 'axios';

const API_URL = 'https://localhost:7248/api/Pedidos'; // VERIFICA QUE EL PUERTO SEA EL CORRECTO

const pedidosService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/Listar`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pedidos:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Listar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pedido with ID ${id}:`, error);
      throw error;
    }
  },

  create: async (pedidoData) => {
    try {
      const response = await axios.post(`${API_URL}/Insertar`, pedidoData);
      return response.data;
    } catch (error) {
      console.error('Error creating pedido:', error);
      throw error;
    }
  },

  update: async (id, pedidoData) => {
    try {
      const response = await axios.put(`${API_URL}/Actualizar/${id}`, pedidoData);
      return response.data;
    } catch (error) {
      console.error(`Error updating pedido with ID ${id}:`, error);
      throw error;
    }
  },

  remove: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/Eliminar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting pedido with ID ${id}:`, error);
      throw error;
    }
  },

  avanzarEstado: async (id) => {
    try {
      // Tu backend usa un PUT a /AvanzarEstado/{id} sin cuerpo de solicitud
      const response = await axios.put(`${API_URL}/AvanzarEstado/${id}`);
      return response.data; // Retorna el mensaje de éxito del backend
    } catch (error) {
      console.error(`Error al avanzar estado del pedido con ID ${id}:`, error);
      throw error;
    }
  },
};

export default pedidosService;