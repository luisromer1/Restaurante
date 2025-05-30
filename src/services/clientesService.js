// src/services/clientesService.js
import ApiService from './apiService';

/**
 * @description Repositorio específico para la entidad Clientes.
 * Hereda la funcionalidad básica de ApiService.
 */
const clientesService = new ApiService('Clientes');

// Puedes añadir métodos específicos para Clientes si los necesitas
// Por ejemplo, si tuvieras un endpoint como '/api/Clientes/BuscarActivos'
// clientesService.getActivos = () => clientesService.request('GET', 'BuscarActivos');

export default clientesService;