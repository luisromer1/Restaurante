// src/services/ventasService.js
import axios from 'axios';

const API_URL = 'https://localhost:7248/api/Ventas'; // ¡VERIFICA QUE EL PUERTO SEA EL CORRECTO!

const ventasService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/Listar`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la lista de ventas:', error);
      throw error; // Es importante lanzar el error para que el componente que lo llama lo maneje
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Listar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener venta con ID ${id}:`, error);
      throw error;
    }
  },

  create: async (ventaData) => {
    try {
      const response = await axios.post(`${API_URL}/Insertar`, ventaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear/actualizar venta:', error);
      throw error;
    }
  },

  update: async (id, ventaData) => {
    try {
      const response = await axios.put(`${API_URL}/Actualizar/${id}`, ventaData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar venta con ID ${id}:`, error);
      throw error;
    }
  },

  remove: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/Eliminar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar venta con ID ${id}:`, error);
      throw error;
    }
  },

  // *******************************************************************
  // MÉTODO PARA CALCULAR VENTAS POR FECHA
  calculateByDate: async (dateString) => { // dateString debe ser 'YYYY-MM-DD'
    try {
      const response = await axios.get(`${API_URL}/CalcularPorFecha?fecha=${dateString}`);
      return response.data;
    } catch (error) {
      console.error(`Error al calcular ventas para la fecha ${dateString}:`, error);
      if (error.response && error.response.status === 404) {
        throw new Error('No se encontraron pedidos para esta fecha.');
      }
      throw error;
    }
  },
};

export default ventasService;