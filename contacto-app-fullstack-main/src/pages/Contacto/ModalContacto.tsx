import { useForm } from "react-hook-form"; /* Importa useForm de react-hook-form */
import {
  actualizarContacto,
  enviarContacto,
} from "./contacto.service"; /* Importa la función enviarContacto del servicio */
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type {
  ContactoForm,
  ContactoRequest,
} from "./contacto.types"; /* Importa el tipo ContactoRequest */
import { useEffect } from "react";

interface Props {
  onClose: () => void;
  contacto?: ContactoForm;
}

/* Definicion del componente ModalContacto */
export const ModalContacto = ({ onClose, contacto }: Props) => {
  // Configuración del formulario con react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactoRequest>();

  /* nos muestra el formulario con los datos para poder editarlo */
  useEffect(() => {
    if (contacto) {
      setValue("nombre", contacto.nombre);
      setValue("correo", contacto.correo);
      setValue("mensaje", contacto.mensaje);
    } else {
      reset(); // Resetea el formulario si no hay contacto
    }
  }, [contacto, setValue]);

  /* Función para enviar el formulario */
  const onSubmit = async (data: ContactoRequest) => {
    try {
      console.log(data);
      if (contacto) {
        await actualizarContacto(
          contacto.id,
          data.nombre,
          data.correo,
          data.mensaje,
          new Date()
        );
        toast.success("Contacto actualizado correctamente", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        
        
        await enviarContacto(data);
        toast.success("Contacto creado correctamente", {
          position: "top-right",
          autoClose: 1000,
        });
      }

      reset();
      onClose();
    } catch (err) {
      toast.error("Error al enviar el mensaje", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    // Estructura del modal
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        {/* Título del modal */}
        <h3 className="text-lg font-bold mb-4">
          Agregar mensaje - Modal Contacto
        </h3>

        {/* Formulario De contacto */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campos del Formulario */}
          <div>
            <label className="block font-medium mb-1">Nombre:</label>
            <input
              className="w-full px-3 py-2 border rounded-xl"
              {...register("nombre", { required: "El nombre es obligatorio" })}
            />
            {errors.nombre && (
              <p className="text-red-500">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Correo electrónico:
            </label>
            {/* Validacion Corrreo electronico */}
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-xl"
              {...register("correo", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Correo no válido",
                },
              })}
            />
            {errors.correo && (
              <p className="text-red-500">{errors.correo.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Mensaje:</label>
            <textarea
              className="w-full px-3 py--2 border rounded-xl"
              rows={4}
              {...register("mensaje", {
                required: "El mensaje es obligatorio",
              })}
            ></textarea>
            {errors.mensaje && (
              <p className="text-red-500">{errors.mensaje.message}</p>
            )}
          </div>
          {/* Botones  formulario */}
          <div className="flex justify-end gap-2">
            {/* boton Cancelar */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              Cancelar
            </button>
            {/* Botón para Actualizar*/}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              {contacto ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
    
      </div>
    </div>
  );
};
