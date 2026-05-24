import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/empleados/";

function ListadoEmpleados() {
  // Estados de la aplicación
  const [empleados, setEmpleados] = useState([]);
  const [idEmpleado, setIdEmpleado] = useState(null);
  const [nombre, setNombre] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [sueldo, setSueldo] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Listar empleados desde el Backend
  const cargarEmpleados = async () => {
    try {
      const respuesta = await axios.get(API_URL);
      setEmpleados(respuesta.data);
    } catch (error) {
      console.error("Error cargando los empleados:", error);
      setMensaje("No se pudo conectar con el servidor backend.");
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  // Modificar
  const guardarEmpleado = async (e) => {
    e.preventDefault();

    // Validaciones básicas en Frontend
    if (!nombre.trim || nombre.trim() === "" || departamento.trim() === "") {
      setMensaje("Por favor llene todos los campos requeridos.");
      return;
    }
    if (parseFloat(sueldo) <= 0 || isNaN(sueldo)) {
      setMensaje("El sueldo debe ser un número positivo mayor a cero.");
      return;
    }

    const payload = { nombre, departamento, sueldo: parseFloat(sueldo) };

    try {
      if (idEmpleado) {
        // Modificar datos de empleado existente
        const respuesta = await axios.put(`${API_URL}${idEmpleado}/`, payload);
        setMensaje(
          respuesta.data.mensaje || "Empleado modificado exitosamente",
        );
      } else {
        // FASE 2: Agregar nuevo empleado (POST)
        const respuesta = await axios.post(API_URL, payload);
        setMensaje(respuesta.data.mensaje || "Empleado agregado con éxito");
      }

      // Limpiar formulario y refrescar tabla
      limpiarFormulario();
      cargarEmpleados();
    } catch (error) {
      if (error.response && error.response.data) {
        // Capturar errores de validación
        const erroresAPI = Object.values(error.response.data).join(" ");
        setMensaje(`Error: ${erroresAPI}`);
      } else {
        setMensaje("Ocurrió un error al procesar la solicitud.");
      }
    }
  };

  // Preparar los campos para modificacio
  const seleccionarEmpleadoEditar = (empleado) => {
    setIdEmpleado(empleado.idEmpleado);
    setNombre(empleado.nombre);
    setDepartamento(empleado.departamento);
    setSueldo(empleado.sueldo);
    setMensaje(`Editando al empleado ID: ${empleado.idEmpleado}`);
  };

  // Eliminar empleado
  const eliminarEmpleado = async (id, nombreEmp) => {
    if (
      window.confirm(`¿Estás seguro de que deseas eliminar a "${nombreEmp}"?`)
    ) {
      try {
        const respuesta = await axios.delete(`${API_URL}${id}/`);
        setMensaje(respuesta.data.mensaje || "Empleado eliminado");
        cargarEmpleados();
        if (idEmpleado === id) limpiarFormulario();
      } catch (error) {
        console.error("Error al eliminar:", error);
        setMensaje("No se pudo eliminar el empleado seleccionado.");
      }
    }
  };

  const limpiarFormulario = () => {
    setIdEmpleado(null);
    setNombre("");
    setDepartamento("");
    setSueldo("");
  };

  return (
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white">
            <h5 className="card-title mb-0">
              {idEmpleado ? "Modificar Empleado" : "Agregar Nuevo Empleado"}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={guardarEmpleado}>
              <div className="mb-3">
                <label className="form-label">Nombre Completo</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Área / Departamento</label>
                <input
                  type="text"
                  className="form-control"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Sueldo Mensual</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={sueldo}
                  onChange={(e) => setSueldo(e.target.value)}
                  required
                />
              </div>
              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className={`btn ${idEmpleado ? "btn-warning" : "btn-success"}`}
                >
                  {idEmpleado ? "Guardar Cambios" : "Registrar Empleado"}
                </button>
                {idEmpleado && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={limpiarFormulario}
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Columna de la Tabla  */}
      <div className="col-md-8">
        {mensaje && (
          <div
            className="alert alert-info alert-dismissible fade show"
            role="alert"
          >
            {mensaje}
          </div>
        )}

        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="card-title mb-0">Nómina Activa (Fase de Listado)</h5>
          </div>
          <div className="card-body p-0">
            {empleados.length === 0 ? (
              <p className="p-4 text-center text-muted mb-0">
                No se encontraron registros de empleados.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0 valign-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Departamento</th>
                      <th>Sueldo</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleados.map((emp) => (
                      <tr key={emp.idEmpleado}>
                        <td>
                          <strong>{emp.idEmpleado}</strong>
                        </td>
                        <td>{emp.nombre}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {emp.departamento}
                          </span>
                        </td>
                        <td>
                          $
                          {parseFloat(emp.sueldo).toLocaleString("es-CO", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              className="btn btn-outline-warning"
                              onClick={() => seleccionarEmpleadoEditar(emp)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() =>
                                eliminarEmpleado(emp.idEmpleado, emp.nombre)
                              }
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListadoEmpleados;
