import axios from 'axios';
import type { ContactoForm, ContactoRequest } from './contacto.types';

const API_URL = import.meta.env.VITE_API_URL;

export const obtenerContactos = async (): Promise<ContactoForm[]> => {
  const res = await axios.get(`${API_URL}/contacto`);
  return res.data;
};
export const enviarContacto = async (data: ContactoRequest) => {
  await axios.post(`${API_URL}/contacto`, data);
};

export const actualizarContacto = async (
  id: number,
  nombre: string,
  correo: string,
  mensaje: string,
  fecha: Date
) => {
  const res = await axios.put(`${API_URL}/contacto/${id}`, {
    nombre,
    correo,
    mensaje,
    fecha: fecha.toISOString(),
  });
  return res.data;
};

export const eliminarContacto = async (id: number) => {
  const res = await axios.delete(`${API_URL}/contacto/${id}`);
  return res.data;
};

  /* id: number,
  nombre: string;
  correo: string;
  mensaje: string;
  fecha: Date; */