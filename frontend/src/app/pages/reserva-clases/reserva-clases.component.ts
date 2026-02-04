import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Reserva } from '../../models/reserva.model';
import {HttpClient} from '@angular/common/http';

interface Celda {
  dia: string;
  hora: string;
  estado: 'disponible' | 'reservado' | 'seleccionado' | 'no-disponible' | 'pasado' | 'confirmada';
  texto?: string;
  color?: string;
}

@Component({
  selector: 'app-reserva-clases',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reserva-clases.component.html',
  styleUrls: ['./reserva-clases.component.css'],
})
export class ReservaClasesComponent implements OnInit {

  isAdmin: boolean = false;
  usuarioEsAdmin: boolean = false;

  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  horas = [
    '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
    '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00'
  ];

  semanas: { key: string; label: string }[] = [];
  asignaturaSeleccionada: string = '';
  semanaSeleccionada: string = '';
  modalidadSeleccionada: string = '';
  nivelSeleccionado: string = '';
  calendario: Celda[][] = [];
  calendarioSeleccionado: Celda[] = [];
  diaAbierto: number | null = null;

  // Modales
  showGenericModal = false;
  genericModalMessage = '';
  showLoginButton = false;
  modalTitle = '';
  modalClass = '';

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {}

  private checkLogin(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.showModal(
        'Atención',
        'Debes iniciar sesión para realizar esta acción.',
        'error-modal',
        true
      );
      return false;
    }
    return true;
  }

  ngOnInit() {
    // Usuario sin login
    const url = this.router.url; // Obtienes la URL actual
    if (!url.includes('/admin')) {
      this.showModal(
        'Atención',
        'Debes iniciar sesión para acceder a esta página y poder reservar.',
        'error-modal',
        true
      );
    }


    this.isAdmin = this.authService.isAdmin();
    this.usuarioEsAdmin = this.isAdmin;

    this.generarSemanas();

    if (this.isAdmin) {
      this.asignaturaSeleccionada = '';
      this.modalidadSeleccionada = '';
      this.nivelSeleccionado = '';
    }
  }

  toggleCeldaSafe(celda?: Celda) {
    if (!celda) return;
    this.toggleCelda(celda);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  private showModal(title: string, message: string, modalClass: string, showLogin: boolean = false) {
    this.modalTitle = title;
    this.genericModalMessage = message;
    this.modalClass = modalClass;
    this.showLoginButton = showLogin;
    this.showGenericModal = true;
  }

  generarSemanas() {
    const today = new Date();
    this.semanas = [];

    for (let i = 0; i < 4; i++) {
      const start = new Date(today);
      start.setDate(start.getDate() + i * 7 - start.getDay() + 1);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      const key = `${start.toISOString().split('T')[0]}_to_${end.toISOString().split('T')[0]}`;
      const label = `${start.getDate()} ${start.toLocaleString('es', { month: 'long' })} - ${end.getDate()} ${end.toLocaleString('es', { month: 'long' })}`;

      this.semanas.push({ key, label });
    }

    if (this.semanas.length > 0) {
      this.semanaSeleccionada = this.semanas[0].key;
      this.crearCalendario();
    }
  }

  crearCalendario() {
    this.calendario = [];
    const reservasPendientes: Reserva[] =
      JSON.parse(localStorage.getItem('reservas-pendientes') || '[]');

    const reservasConfirmadas: Reserva[] =
      JSON.parse(localStorage.getItem('reservas-confirmadas') || '[]');

// Unimos ambas listas en una sola
    const reservasGlobales: Reserva[] = [
      ...reservasPendientes,
      ...reservasConfirmadas
    ];
    const emailUsuario = localStorage.getItem('email') || '';
    const ahora = new Date();
    const bloqueosAdmin = JSON.parse(localStorage.getItem(this.semanaSeleccionada) || '{}');

    for (const hora of this.horas) {
      const fila: Celda[] = [];
      for (const dia of this.dias) {
        const key = `${dia}-${hora}`;
        let estado: Celda['estado'] = 'disponible';
        let texto: string = '';

        // ---- Bloqueos del admin ----
        if (bloqueosAdmin[key] === 'no-disponible') {
          estado = 'no-disponible';
          texto = 'No disponible';
        }

        // ---- Reservas ----
        const reservaPendiente = reservasGlobales.find(
          r => r.horario === key && r.estado === 'Pendiente'
        );

        const reservaConfirmada = reservasGlobales.find(
          r => r.horario === key && r.estado === 'Confirmada'
        );

        // ---- CLASES CONFIRMADAS ----
        if (reservaConfirmada) {
          // Dueño de la reserva o Admin → mostrar como reservado
          if (reservaConfirmada.email === emailUsuario || this.usuarioEsAdmin) {
            estado = 'reservado';
            texto = `Clase de ${reservaConfirmada.asignatura} ✔ Confirmada`;
          } else {
            // Otros usuarios → aparece como ocupada genérica
            estado = 'no-disponible';
            texto = 'No disponible';
          }
        }

        // ---- CLASES PENDIENTES ----
        else if (reservaPendiente) {
          if (reservaPendiente.email === emailUsuario || this.isAdmin) {
            // Para dueño o admin → aparece en amarillo como reservado
            estado = 'reservado';
            texto = `Clase de ${reservaPendiente.asignatura}`;
          } else {
            // Otros usuarios no pueden pillarla
            estado = 'no-disponible';
            texto = 'No disponible';
          }
        }

        // ---- HORAS PASADAS ----
        const diaIndex = this.dias.indexOf(dia);
        const fechaDia = new Date(this.getSemana()[diaIndex]);
        const [inicio, fin] = hora.split('-').map(h => parseInt(h, 10));
        fechaDia.setHours(fin, 0, 0, 0);

        if (fechaDia < ahora && estado === 'disponible') {
          estado = 'pasado';
        }

        // ---- Push final ----
        fila.push({
          dia,
          hora,
          estado,
          texto,
          // Amarillo solo para pendientes del dueño/admin
          color: reservaPendiente && reservaPendiente.email === emailUsuario ? '#f4d03f' : undefined
        });
      }
      this.calendario.push(fila);
    }

    this.calendarioSeleccionado = [];
  }


  toggleCelda(celda: Celda) {
    if (!this.checkLogin()) return;
    if (celda.estado === 'pasado') return;

    const reservas = JSON.parse(localStorage.getItem(this.semanaSeleccionada) || '{}');
    const key = `${celda.dia}-${celda.hora}`;

    // Admin: marcar como no-disponible o disponible
    if (this.isAdmin) {
      if (celda.estado === 'no-disponible') {
        celda.estado = 'disponible';
        delete reservas[key];
      } else {
        celda.estado = 'no-disponible';
        reservas[key] = 'no-disponible';
      }
      localStorage.setItem(this.semanaSeleccionada, JSON.stringify(reservas));
      return;
    }

    // Usuario normal: seleccionar/des-seleccionar
    if (celda.estado === 'disponible') {
      celda.estado = 'seleccionado';
      this.calendarioSeleccionado.push(celda);
    } else if (celda.estado === 'seleccionado') {
      celda.estado = 'disponible';
      this.calendarioSeleccionado = this.calendarioSeleccionado.filter(c => c !== celda);
    }
  }
  reservar() {

    if (!this.checkLogin()) return;

    // Solo validar campos si NO es admin
    if (!this.isAdmin &&
      (!this.asignaturaSeleccionada || !this.semanaSeleccionada || !this.modalidadSeleccionada || !this.nivelSeleccionado || this.calendarioSeleccionado.length === 0)) {
      this.showModal('Atención', 'Por favor, rellena todos los campos antes de reservar.', 'error-modal', true);
      return;
    }

    // Admin: solo guardar cambios de no-disponible
    if (this.isAdmin) {
      const reservasSemana = JSON.parse(localStorage.getItem(this.semanaSeleccionada) || '{}');

      this.calendarioSeleccionado.forEach(celda => {
        const key = `${celda.dia}-${celda.hora}`;

        if (celda.estado === 'no-disponible') {
          reservasSemana[key] = 'no-disponible';
        } else if (celda.estado === 'disponible') {
          delete reservasSemana[key];
        }
      });

      localStorage.setItem(this.semanaSeleccionada, JSON.stringify(reservasSemana));
      this.calendarioSeleccionado = [];
      this.showModal('¡Genial!', 'Disponibilidad guardada correctamente.', 'success-modal');
      return;


      // Refrescar calendario
      this.crearCalendario();

      // Mostrar mensaje de éxito
      this.showModal(
        'Cambios guardados',
        'Se ha actualizado correctamente.',
        'success-modal'
      );

      // Limpiar selección
      this.calendarioSeleccionado = [];
      return; // IMPORTANTE: salir aquí para que no ejecute más código
    }

    // Usuario normal → validación de asignatura, nivel y modalidad
    if (!this.asignaturaSeleccionada || !this.nivelSeleccionado || !this.modalidadSeleccionada) {
      this.showModal(
        'Atención',
        'Debes seleccionar asignatura, nivel y modalidad antes de reservar.',
        'error-modal'
      );
      return;
    }

    // Código existente para guardar reservas de usuario
    const email = localStorage.getItem('email')!;
    const reservasAGuardar = this.calendarioSeleccionado.map(celda => ({
      asignatura: this.asignaturaSeleccionada,
      horario: `${celda.dia}-${celda.hora}`,
      nivel: this.nivelSeleccionado,
      profesor: 'Kenneth Jensen',
      modalidad: this.modalidadSeleccionada,
      fecha: new Date(),
      estado: 'Pendiente',
      alumno: email,
      email: email,
      semana: this.semanaSeleccionada
    }));

    this.guardarLocal(reservasAGuardar);
    this.calendarioSeleccionado = [];
    this.crearCalendario();

    this.showModal(
      'Reserva realizada',
      'Tu clase ha sido reservada correctamente.',
      'success-modal'
    );
  }



  guardarLocal(reservas: any[]) {
    const email = localStorage.getItem('email')!;
    const userReservas: any[] = JSON.parse(localStorage.getItem(`reservas-${email}`) || '[]');
    const reservasGlobales: any[] = JSON.parse(localStorage.getItem('reservas-pendientes') || '[]');

    reservas.forEach(r => {
      userReservas.push(r);
      reservasGlobales.push(r);
      const reservasSemana = JSON.parse(localStorage.getItem(this.semanaSeleccionada) || '{}');
      reservasSemana[r.horario] = 'reservado';
      localStorage.setItem(this.semanaSeleccionada, JSON.stringify(reservasSemana));
    });

    localStorage.setItem(`reservas-${email}`, JSON.stringify(userReservas));
    localStorage.setItem('reservas-pendientes', JSON.stringify(reservasGlobales));
  }

  semanaActual = new Date();

  getSemana(): Date[] {
    const startOfWeek = new Date(this.semanaActual);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);

    const diasSemana: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(startOfWeek);
      dia.setDate(startOfWeek.getDate() + i);
      diasSemana.push(dia);
    }
    return diasSemana;
  }

  get semanaTexto(): string {
    const dias = this.getSemana();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const inicio = dias[0].toLocaleDateString('es-ES', options);
    const fin = dias[6].toLocaleDateString('es-ES', options);
    return `${inicio} - ${fin}`;
  }

  anteriorSemana() {
    const index = this.semanas.findIndex(s => s.key === this.semanaSeleccionada);
    if (index > 0) {
      this.semanaSeleccionada = this.semanas[index - 1].key;
      this.actualizarSemanaActual();
    }
  }

  siguienteSemana() {
    const index = this.semanas.findIndex(s => s.key === this.semanaSeleccionada);
    if (index < this.semanas.length - 1) {
      this.semanaSeleccionada = this.semanas[index + 1].key;
      this.actualizarSemanaActual();
    }
  }

  actualizarSemanaActual() {
    const inicio = new Date(this.semanaSeleccionada.split('_to_')[0]);
    this.semanaActual = inicio;
    this.crearCalendario();
  }

  goToLogin() {
    this.router.navigate(['/iniciar-sesion']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }
  cambiarSemana() {
    this.crearCalendario();
  }

// Expandir/contraer un día en móvil/tablet
  toggleDia(index: number) {
    this.diaAbierto = this.diaAbierto === index ? null : index;
  }
}



