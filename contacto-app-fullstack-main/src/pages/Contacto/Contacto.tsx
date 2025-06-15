import "react-toastify/dist/ReactToastify.css";

import type { ContactoForm } from "./contacto.types";
import { useEffect, useState } from "react";
import { ModalContacto } from "./ModalContacto";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { eliminarContacto, obtenerContactos } from "./contacto.service";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

//Definición del componente Contacto
export const Contacto = () => {
  const [contacto, setContacto] = useState<ContactoForm[]>([]); // Estado para almacenar los contactos obtenidos
  const [mostrarModal, setMostrarModal] = useState(false); // Estado para controlar la visibilidad del modal

  const [contactoEditando, setContactoEditando] = useState<
    ContactoForm | undefined
  >();

  // Función para obtner los contactos desde
  const cargarMensajes = async () => {
    try {
      const data = await obtenerContactos(); //llama a obtenerContactos() para cargar los datos de la API
      setContacto(data); // Actualiza el estado con los datos obtenidos
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
    }
  };
  // Cargar contactos al montar el componente
  useEffect(() => {
    cargarMensajes(); //Ejecuta la función cargarMensajes() al montar el componente
  }, []);

  // Funciones para abrir y cerrar el modal
  const abrirModal = (contacto?: ContactoForm) => {
    setContactoEditando(contacto ?? undefined);
    setMostrarModal(true);
    // Si se pasa un contacto, se establece como el contacto que se está editando
  };

  const cerrarModal = () => {
    setContactoEditando(undefined); // Limpia el contacto editando
    setMostrarModal(false);
    cargarMensajes();
  };

  const confirmarEliminacion = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Está seguro de eliminar?",
      //text: "No podrá revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      //width: "500px",
    });

    if (result.isConfirmed) {
      await eliminarContacto(id);
      toast.success("Mensaje eliminado", {
        position: "top-right",
        autoClose: 1000,
      });
      // Actualizar la lista de contactos localmente
      setContacto((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Formato de fecha para mostrar en la tabla
  const formatoFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);

    /* Obtener valores UTC para evitar desfase */
    const dia = String(fecha.getUTCDate()).padStart(2, "0");
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
    const anio = fecha.getUTCFullYear();

    return `${dia}/${mes}/${anio}`;
  };

  // Renderiza el componente Contacto
  // que muestra una tabla con los contactos y un botón para agregar nuevos
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Contactos
        </h2>
        {/* Botón para abrir el modal de agregar contacto */}
        <button
          onClick={() => abrirModal()}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        >
          <FiPlus className="text-lg" />
          <span className="text-sm sm:text-base">Agregar</span>
        </button>
      </div>
      {/* Tabla que muestra los contactos obtenidos */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border bg-white border-gray-300 mt-4 rounded-xl shadow">
          <thead>
            {" "}
            {/* Encabezados de la tabla */}
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">Correo</th>
              <th className="text-left px-4 py-2">Mensaje</th>
              <th className="text-left px-4 py-2">Fecha</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {" "}
            {/* Cuerpo de la tabla donde se muestran los contactos */}
            {contacto.map((m) => (
              <tr key={m.id} className="border-t border-gray-200">
                <td className="px-4 py-2">{m.id}</td>
                <td className="px-4 py-2">{m.nombre}</td>
                <td className="px-4 py-2">{m.correo}</td>
                <td className="px-4 py-2">{m.mensaje}</td>
                <td className="px-4 py-2">{formatoFecha(m.fecha)}</td>
                <td className="p-2 flex justify-center gap-3">
                  {/* Botón para editar el contacto */}
                  <button
                    onClick={() => abrirModal(m)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit />
                  </button>
                  {/* Botón para eliminar el contacto */}
                  <button
                    onClick={() => confirmarEliminacion(m.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*Renderiza el Modal para agregar un nuevo contacto */}

      {mostrarModal && (
        <ModalContacto onClose={cerrarModal} contacto={contactoEditando} />
      )}
      <ToastContainer />
    </div>
  );
};
