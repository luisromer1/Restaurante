import React, { useState, useEffect } from 'react';
import './UsuarioForm.css'; // Estilos específicos del formulario de usuario
import usuariosService from '../services/usuariosService'; // Usamos usuariosService para obtener usuarios y sus personas
import rolesService from '../services/rolesService'; // Asume que existe

function UsuarioForm({ usuarioInicial, onSubmit, onCancel }) {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [idPersona, setIdPersona] = useState('');
  const [idRol, setIdRol] = useState('');

  const [personas, setPersonas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingDependencies, setLoadingDependencies] = useState(true);
  const [errorDependencies, setErrorDependencies] = useState(null);
  const [formMessage, setFormMessage] = useState(null);

  useEffect(() => {
    // Cargar personas y roles al montar el componente
    const fetchDependencies = async () => {
      try {
        setLoadingDependencies(true);
        // Usamos usuariosService.getAll() para obtener la lista de usuarios
        // y luego extraemos las personas de ellos.
        const fetchedUsers = await usuariosService.getAll();
        const fetchedRoles = await rolesService.getAll();

        // Extraer personas únicas de los usuarios obtenidos
        const uniquePersonas = [];
        const personaIds = new Set(); // Para evitar duplicados
        fetchedUsers.forEach(user => {
          if (user.persona && !personaIds.has(user.persona.id)) {
            uniquePersonas.push(user.persona);
            personaIds.add(user.persona.id);
          }
        });
        setPersonas(uniquePersonas);
        setRoles(fetchedRoles);
        setErrorDependencies(null);
      } catch (err) {
        setErrorDependencies('Error al cargar datos de personas o roles. Asegúrate de que los servicios existan y funcionen correctamente.');
        console.error("Error al cargar dependencias:", err);
      } finally {
        setLoadingDependencies(false);
      }
    };
    fetchDependencies();
  }, []);

  useEffect(() => {
    if (usuarioInicial) {
      setNombreUsuario(usuarioInicial.nombreUsuario || '');
      setCorreo(usuarioInicial.correo || '');
      setContrasena(''); // La contraseña nunca se precarga para edición
      setIdPersona(usuarioInicial.id_Persona || '');
      setIdRol(usuarioInicial.id_Rol || '');
    } else {
      setNombreUsuario('');
      setCorreo('');
      setContrasena('');
      setIdPersona('');
      setIdRol('');
    }
  }, [usuarioInicial]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    if (!nombreUsuario || !correo || !idPersona || !idRol || (!usuarioInicial && !contrasena)) {
      setFormMessage('Por favor, completa todos los campos, incluyendo la contraseña para nuevos usuarios.');
      setTimeout(() => setFormMessage(null), 3000);
      return;
    }

    onSubmit({
      id: usuarioInicial?.id,
      nombreUsuario,
      correo,
      contrasena: contrasena || undefined, // Solo enviar si no es vacío (para edición)
      id_Persona: parseInt(idPersona, 10),
      id_Rol: parseInt(idRol, 10),
    });
  };

  if (loadingDependencies) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-700">Cargando datos para el formulario de usuario...</p>
      </div>
    );
  }

  if (errorDependencies) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center font-medium" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {errorDependencies}</span>
      </div>
    );
  }

  return (
    <div className="usuario-form-container mx-auto max-w-2xl"> {/* Contenedor con estilos de CSS y centrado */}
      <h3 className="text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b-2 border-blue-500 text-center"> {/* Título más grande y con borde, centrado */}
        {usuarioInicial ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </h3>

      {formMessage && (
        <div className="p-4 mb-4 rounded-lg bg-red-100 text-red-700 text-center font-medium"> {/* Mensaje centrado y con mejor estilo */}
          {formMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="nombreUsuario" className="block text-sm font-semibold mb-2">Nombre de Usuario:</label>
            <input
              type="text"
              id="nombreUsuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              placeholder="Ej: juanperez"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base"
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo" className="block text-sm font-semibold mb-2">Correo Electrónico:</label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ej: correo@ejemplo.com"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="contrasena" className="block text-sm font-semibold mb-2">Contraseña:</label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder={usuarioInicial ? 'Dejar en blanco para no cambiar' : 'Contraseña'}
              required={!usuarioInicial} // Requerido solo para nuevos usuarios
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base"
            />
          </div>

          <div className="form-group">
            <label htmlFor="idPersona" className="block text-sm font-semibold mb-2">Persona Asociada:</label>
            <select
              id="idPersona"
              value={idPersona}
              onChange={(e) => setIdPersona(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base appearance-none bg-white pr-8"
            >
              <option value="">Selecciona una persona</option>
              {personas.map(persona => (
                <option key={persona.id} value={persona.id}>
                  {`${persona.nombre} ${persona.apellido}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="idRol" className="block text-sm font-semibold mb-2">Rol:</label>
          <select
            id="idRol"
            value={idRol}
            onChange={(e) => setIdRol(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base appearance-none bg-white pr-8"
          >
            <option value="">Selecciona un rol</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="btn-form-cancel"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-form-submit"
          >
            {usuarioInicial ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UsuarioForm;
