// src/components/UsuarioForm.jsx
import React, { useState, useEffect } from 'react';
import './UsuarioForm.css'; // Crearemos este CSS
import clientesService from '../services/clientesService'; // Para obtener personas (clientes son personas)
import rolesService from '../services/rolesService'; // Para obtener roles

function UsuarioForm({ usuarioInicial = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id: usuarioInicial?.id || 0,
    nombreUsuario: usuarioInicial?.nombreUsuario || '',
    correo: usuarioInicial?.correo || '',
    contrasena: '', // No precargamos la contraseña por seguridad
    // Si la edición no permite cambiar contraseña, se puede ocultar o manejar por separado
    id_Persona: usuarioInicial?.id_Persona || '', // Para la selección de persona
    id_Rol: usuarioInicial?.id_Rol || '', // Para la selección de rol
  });

  const [personas, setPersonas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingDependencies, setLoadingDependencies] = useState(true);
  const [errorDependencies, setErrorDependencies] = useState(null);

  // Cargar personas y roles al montar el componente
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        setLoadingDependencies(true);
        // Usamos clientesService para obtener la lista de personas, ya que clientes tienen una persona asociada.
        // Si tuvieras un 'personaService' directo, sería mejor usarlo.
        const clientesData = await clientesService.getAll();
        // Mapear clientes a un formato de persona si es necesario, o directamente usar cliente.persona
        const personasFromClientes = clientesData.map(c => ({
          id: c.persona.id, // Asegúrate de que tu modelo de Cliente incluya la Persona
          nombreCompleto: `${c.persona.nombre} ${c.persona.apellido}`
        }));
        setPersonas(personasFromClientes);

        const rolesData = await rolesService.getAll();
        setRoles(rolesData);

      } catch (err) {
        setErrorDependencies('Error al cargar dependencias (personas/roles) para el formulario.');
        console.error("Error cargando dependencias:", err);
      } finally {
        setLoadingDependencies(false);
      }
    };
    fetchDependencies();
  }, []);

  // Actualizar formData si usuarioInicial cambia (para edición)
  useEffect(() => {
    if (usuarioInicial) {
      setFormData({
        id: usuarioInicial.id,
        nombreUsuario: usuarioInicial.nombreUsuario,
        correo: usuarioInicial.correo,
        contrasena: '', // No precargamos la contraseña para edición. Si se necesita, el usuario deberá ingresarla.
        id_Persona: usuarioInicial.id_Persona,
        id_Rol: usuarioInicial.id_Rol,
      });
    } else {
      // Resetear para nuevo usuario si usuarioInicial es null
      setFormData({
        id: 0,
        nombreUsuario: '',
        correo: '',
        contrasena: '',
        id_Persona: '',
        id_Rol: '',
      });
    }
  }, [usuarioInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Asegurarse de que Id_Persona e Id_Rol sean números enteros
    const dataToSend = {
      ...formData,
      id_Persona: parseInt(formData.id_Persona, 10), // Convertir a entero
      id_Rol: parseInt(formData.id_Rol, 10), // Convertir a entero
    };

    // Si es una creación y la contraseña está vacía, no se envía un campo 'Contrasena' vacío
    // Si es una edición y la contraseña está vacía, significa que no se desea cambiar
    if (usuarioInicial && dataToSend.contrasena === '') {
      delete dataToSend.contrasena; // No enviar la contraseña si no se ha modificado en la edición
    } else if (!usuarioInicial && dataToSend.contrasena === '') {
      // Si es un nuevo usuario, la contraseña es obligatoria.
      // Aquí podrías agregar una validación de frontend para `required`
      alert('La contraseña es obligatoria para un nuevo usuario.');
      return;
    }
    onSubmit(dataToSend);
  };

  if (loadingDependencies) {
    return <div className="usuario-form-container">Cargando datos para el formulario...</div>;
  }

  if (errorDependencies) {
    return <div className="usuario-form-container error">{errorDependencies}</div>;
  }

  return (
    <div className="usuario-form-container">
      <h3>{usuarioInicial ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
      <form onSubmit={handleSubmit} className="usuario-form">
        <div className="form-group">
          <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
          <input
            type="text"
            id="nombreUsuario"
            name="nombreUsuario"
            value={formData.nombreUsuario}
            onChange={handleChange}
            required
            placeholder="Ej: jlopez_admin"
          />
        </div>
        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico:</label>
          <input
            type="email" // Usar type="email" para validación básica
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            placeholder="ejemplo@dominio.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="contrasena">Contraseña {usuarioInicial ? '(Dejar en blanco para no cambiar)' : '*'}:</label>
          <input
            type="password"
            id="contrasena"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            // La contraseña es obligatoria para nuevos usuarios, opcional para edición
            required={!usuarioInicial}
            placeholder={usuarioInicial ? '********' : 'Mínimo 6 caracteres'}
          />
        </div>
        <div className="form-group">
          <label htmlFor="id_Persona">Persona Asociada:</label>
          <select
            id="id_Persona"
            name="id_Persona"
            value={formData.id_Persona}
            onChange={handleChange}
            required
            className="select-input"
          >
            <option value="">Seleccione una persona</option>
            {personas.map(persona => (
              <option key={persona.id} value={persona.id}>
                {persona.nombreCompleto}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="id_Rol">Rol:</label>
          <select
            id="id_Rol"
            name="id_Rol"
            value={formData.id_Rol}
            onChange={handleChange}
            required
            className="select-input"
          >
            <option value="">Seleccione un rol</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {usuarioInicial ? 'Actualizar Usuario' : 'Guardar Usuario'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default UsuarioForm;