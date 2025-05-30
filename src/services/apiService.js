// src/services/apiService.js
import { API_BASE_URL } from '../config';

/**
 * @description Clase base para interactuar con la API, implementando el patrón Repository.
 * Encapsula la lógica de las peticiones HTTP.
 */
class ApiService {
  constructor(endpoint) {
    this.baseUrl = `${API_BASE_URL}/${endpoint}`; // Ejemplo: http://localhost:5000/api/Clientes
  }

  async request(method, path = '', data = null) {
    const url = `${this.baseUrl}${path ? `/${path}` : ''}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Aquí podrías añadir un token de autenticación si lo necesitas en el futuro
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        // Si la respuesta no es 2xx, lanza un error con el mensaje del backend
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      // Algunas operaciones (ej. DELETE, PUT sin contenido de retorno) no devuelven JSON
      if (response.status === 204 || response.status === 202) { // 204 No Content, 202 Accepted
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`Error en la petición ${method} a ${url}:`, error);
      throw error; // Re-lanza el error para que los componentes puedan manejarlo
    }
  }

  async getAll() {
    return this.request('GET', 'Listar');
  }

  async getById(id) {
    return this.request('GET', `Listar/${id}`);
  }

  async create(data) {
    return this.request('POST', 'Insertar', data);
  }

  async update(id, data) {
    return this.request('PUT', `Actualizar/${id}`, data);
  }

  async remove(id) {
    return this.request('DELETE', `Eliminar/${id}`);
  }
}

export default ApiService;