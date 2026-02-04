export interface Reserva {
  alumno: string;           // nombre del alumno (si no existe, se usa el email)
  email: string;
  asignatura: string;
  fechaReserva: Date;       // → importante: tu componente usa fechaReserva
  hora: string;             // → tu componente busca r.horario y r.hora...
  horario?: string;         // opcional porque lo usas en los findIndex
  modalidad?: string;
  nivel?: string;
  estado?: string;          // porque lo modificas en admin
  precio: number;
  mensajePago?: string;

  pagado?: boolean;
  hrefPago?: string;
  orderId?: string;
  semana: string;
}
