export interface Reserva {
  idReserva: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  asignatura: string;
  fechaClase: string;
  hora: string;
  bono?: string;
  modalidad?: string;
  nivel?: string;
  estado?: string;
  fechaReserva?: string;
}
