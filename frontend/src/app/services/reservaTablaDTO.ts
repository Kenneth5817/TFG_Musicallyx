export interface ReservaTablaDTO {
  nombreAlumno: string;
  nombreClase: string;
  profesorClase:string;
  idReserva: number;
  estado: string;
  fechaReserva: string; // o Date si quieres manejarlo como Date
  metodoPago: string;
  email: string;
  precio: number;
}
