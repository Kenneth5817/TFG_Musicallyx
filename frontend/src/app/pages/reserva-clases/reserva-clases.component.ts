import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

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
  isMobile: boolean = false;
  isUsuarioLogueado: boolean = false;
  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  horas = [
    '9:00-10:00','10:00-11:00','11:00-12:00','12:00-13:00',
    '16:00-17:00','17:00-18:00','18:00-19:00','19:00-20:00','20:00-21:00'
  ];

  asignaturaSeleccionada = '';
  modalidadSeleccionada = '';
  bonoSeleccionado = '';
  nivelSeleccionado = '';
  metodoPago = '';
  semanaSeleccionada = '';
  semanaActual = new Date();

  calendario: Celda[][] = [];
  calendarioSeleccionado: Celda[] = [];
  diaAbierto: number | null = null;

  // Modal
  showGenericModal = false;
  modalTitle = '';
  genericModalMessage = '';
  modalClass = '';
  showLoginButton = false;
  showFormularioReserva = false;
  showPostReservaModal = false;
  modalCallback: (() => void) | null = null;

  // Invitado
  nombreInvitado = '';
  apellidoInvitado = '';
  emailInvitado = '';
  telefonoInvitado = '';

  semanas: { key: string, label: string }[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin() && this.authService.isLoggedIn();
    this.usuarioEsAdmin = this.isAdmin;

    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());

    this.generarSemanas();
  }

  checkScreen() { this.isMobile = window.innerWidth < 1025; }

  showModal(title: string, message: string, modalClass: string, callback?: () => void, showLogin: boolean = false) {
    this.modalTitle = title;
    this.genericModalMessage = message;
    this.modalClass = modalClass;
    this.showLoginButton = showLogin;
    this.showGenericModal = true;
    this.modalCallback = callback || null;
  }

  cerrarModal() {
    this.showGenericModal = false;
    if (this.modalCallback) { this.modalCallback(); this.modalCallback = null; }
  }

  private getDayIndex(fechaStr: string, inicioStr: string): number {
    const fecha = new Date(fechaStr);
    const inicio = new Date(inicioStr);

    return Math.round(
      (fecha.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)
    );
  }
  // ----------------------------
  // Semanas y calendario
  // ----------------------------
  generarSemanas() {
    const today = new Date();
    this.semanas = [];

    for (let i = 0; i < 4; i++) {
      const start = new Date(today);
      start.setDate(start.getDate() + i*7 - start.getDay() + 1);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      const key = `${start.toISOString().split('T')[0]}_to_${end.toISOString().split('T')[0]}`;
      const label = `${start.getDate()} ${start.toLocaleString('es', { month: 'long' })} - ${end.getDate()} ${end.toLocaleString('es', { month: 'long' })}`;
      this.semanas.push({ key, label });
    }

    if (this.semanas.length) {
      this.semanaSeleccionada = this.semanas[0].key;
      this.crearCalendario();
    }
  }

  getSemana(): Date[] {
    const startOfWeek = new Date(this.semanaActual);
    const diff = startOfWeek.getDay() === 0 ? -6 : 1 - startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() + diff);

    const diasSemana: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      diasSemana.push(d);
    }
    return diasSemana;
  }
  private parseDateOnly(dateStr: string): Date {
    if (!dateStr) return new Date(NaN);

    const clean = dateStr.split('T')[0];
    const [y, m, d] = clean.split('-').map(Number);

    return new Date(Date.UTC(y, m - 1, d)); // 👈 CLAVE
  }
  crearCalendario() {
    const emailUsuario = localStorage.getItem('email') || '';

    // 🧱 inicializar calendario vacío
    this.calendario = this.horas.map(hora =>
      this.dias.map(dia => ({
        dia,
        hora,
        estado: 'no-disponible' as const,
        texto: ''
      }))
    );

    const horariosLibres = [
      '16:00-17:00','17:00-18:00','18:00-19:00',
      '19:00-20:00','20:00-21:00'
    ];

    const diasLibres = ['Miércoles','Jueves','Viernes'];

    const inicioSemana = new Date(this.semanaSeleccionada.split('_to_')[0]);

    // 🔥 PINTADO BASE + BLOQUEO 48H
    this.calendario.forEach((fila, filaIndex) => {
      fila.forEach((celda) => {

        const esValida =
          diasLibres.includes(celda.dia) &&
          horariosLibres.includes(celda.hora);

        if (!esValida) {
          celda.estado = 'no-disponible';
          celda.texto = '';
          return;
        }

        const fechaReal = new Date(inicioSemana);

        const diaIndex = this.dias.indexOf(celda.dia);
        fechaReal.setDate(inicioSemana.getDate() + diaIndex);

        const horaInicio = celda.hora.split('-')[0];
        const [h, m] = horaInicio.split(':').map(Number);
        fechaReal.setHours(h, m, 0, 0);

        if (!this.puedeReservarFechaCompleta(fechaReal)) {
          celda.estado = 'no-disponible';
          celda.texto = '';
          return;
        }

        celda.estado = 'disponible';
        celda.texto = '';
      });
    });

    // 🚨 BACKEND RESERVAS
    if (!this.semanaSeleccionada) {
      console.warn('⚠️ semanaSeleccionada undefined, cancelando carga');
      return;
    }

    const semana = this.semanaSeleccionada;

    this.http.get<any[]>(
      `https://tfg-musicallyx.onrender.com/v1/api/reservas/semana/${semana}`
    ).subscribe({
      next: (reservasBackend) => {

        reservasBackend.forEach(reserva => {
          const filaIndex = this.horas.indexOf(reserva.hora);
          if (filaIndex < 0) return;

          const fechaStr = reserva.fechaClase || reserva.fechaReserva || reserva.fecha;
          if (!fechaStr) return;

          const fechaInicio = this.parseDateOnly(this.semanaSeleccionada.split('_to_')[0]);
          const fechaRes = this.parseDateOnly(fechaStr.split('T')[0]);

          const diaIndex = Math.floor(
            (fechaRes.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diaIndex < 0 || diaIndex >= this.dias.length) return;

          const celda = this.calendario[filaIndex][diaIndex];

          celda.estado =
            reserva.email === emailUsuario ? 'reservado' : 'no-disponible';

          celda.texto =
            reserva.email === emailUsuario
              ? `Tu clase: ${reserva.asignatura} - ${reserva.nombre}`
              : `Clase reservada`;
        });
      },
      error: () => {
        console.warn('Backend no disponible → usando localStorage');
        this.marcarReservas();
      }
    });

    // 🚨 NUEVO: BACKEND BLOQUEOS (ESTO ES LO QUE TE FALTABA)
    const [start, end] = this.semanaSeleccionada.split('_to_');

    this.http.get<any[]>(
      `https://tfg-musicallyx.onrender.com/v1/api/bloqueos/semana?start=${start}&end=${end}`
    ).subscribe({
      next: (bloqueos) => {

        bloqueos.forEach(b => {
          const filaIndex = this.horas.indexOf(b.hora);
          if (filaIndex < 0) return;

          const fechaInicio = this.parseDateOnly(start);
          const fechaBloqueo = this.parseDateOnly(b.fecha);

          const diaIndex = Math.floor(
            (fechaBloqueo.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diaIndex < 0 || diaIndex >= this.dias.length) return;

          const celda = this.calendario[filaIndex][diaIndex];

          // 🔴 solo bloquear si no es reserva del usuario
          if (celda.estado !== 'reservado') {
            celda.estado = 'no-disponible';
            celda.texto = 'Bloqueado';
          }
        });
      },
      error: () => {
        console.warn('No se pudieron cargar bloqueos');
      }
    });
  }

  private puedeReservar(fechaStr: string): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fecha = this.parseDateOnly(fechaStr);
    const limite = new Date(hoy);
    limite.setDate(limite.getDate() + 2);

    return fecha >= limite;
  }

  toggleCeldaUsuario(celda: Celda) {
    if (!celda) return;
    if (celda.estado !== 'disponible' && celda.estado !== 'seleccionado') return;

    // 🔁 Permitir cambiar selección
    if (this.calendarioSeleccionado.length) {
      this.calendarioSeleccionado[0].estado = 'disponible';
      this.calendarioSeleccionado = [];
    }

    // 📅 Fecha base semana
    const inicioSemana = new Date(this.semanaSeleccionada.split('_to_')[0]);
    const diaIndex = this.dias.indexOf(celda.dia);

    const fechaReal = new Date(inicioSemana);
    fechaReal.setDate(inicioSemana.getDate() + diaIndex);

    // ⏰ SACAR HORA REAL (ej: "16:00")
    const horaInicio = celda.hora.split('-')[0];
    const [h, m] = horaInicio.split(':').map(Number);

    fechaReal.setHours(h, m, 0, 0);

    // 🚫 VALIDACIÓN REAL (fecha + hora)
    if (!this.puedeReservarFechaCompleta(fechaReal)) {
      this.showModal(
        'No disponible',
        'Debes reservar con al menos 48 horas de antelación',
        'error-modal'
      );
      return;
    }

    // ✅ seleccionar
    celda.estado = 'seleccionado';
    this.calendarioSeleccionado.push(celda);
  }

  private puedeReservarFechaCompleta(fechaClase: Date): boolean {
    const ahora = new Date();

    const limite = new Date(ahora);
    limite.setHours(limite.getHours() + 48); // 🔥 EXACTO 48h

    return fechaClase >= limite;
  }


  toggleCeldaAdmin(celda: Celda) {
    if (!celda) return;
    const reservasSemana = JSON.parse(localStorage.getItem(this.semanaSeleccionada) || '{}');
    const key = `${celda.dia}-${celda.hora}`;

    if (celda.estado === 'no-disponible') {
      celda.estado = 'disponible';
      delete reservasSemana[key];
    } else if (celda.estado === 'disponible') {
      celda.estado = 'no-disponible';
      reservasSemana[key] = 'no-disponible';
    }
    localStorage.setItem(this.semanaSeleccionada, JSON.stringify(reservasSemana));
  }

  // reserva-clases.component.ts
  tieneClasesDisponibles(diaIndex: number): boolean {
    // Recorremos todas las filas de horas para ese día
    for (let i = 0; i < this.calendario.length; i++) {
      const celda = this.calendario[i][diaIndex];
      if (celda && (celda.estado === 'disponible' || celda.estado === 'seleccionado')) {
        return true; // hay al menos una clase disponible
      }
    }
    return false; // no hay clases disponibles
  }
  reservar() {
    const errores: string[] = [];


    if (!this.asignaturaSeleccionada) errores.push('asignatura');
    if (!this.nivelSeleccionado) errores.push('nivel');
    if (!this.modalidadSeleccionada) errores.push('modalidad');
    if (!this.bonoSeleccionado) errores.push('tipo de clase/bono');
    if (!this.metodoPago) errores.push('método de pago');
    if (!this.calendarioSeleccionado || this.calendarioSeleccionado.length === 0) errores.push('horario');

    if (errores.length) {
      this.mostrarError(`Faltan los siguientes campos: ${errores.join(', ')}`);
      return;
    }

    const email = localStorage.getItem('email');
    this.isUsuarioLogueado = !!email && this.authService.isLoggedIn();

    if (this.isUsuarioLogueado) {
      // Usuario registrado → enviar y mostrar modal simple
      this.enviarReservasBackend();
    } else {
      // Invitado → mostrar modal de formulario
      this.showFormularioReserva = true;
    }
  }

// Método para mostrar modal de error
  mostrarError(mensaje: string) {
    this.genericModalMessage = mensaje;
    this.modalTitle = '¡Ups! Campos incompletos';
    this.modalClass = 'error-modal';
    this.showGenericModal = true;
  }confirmarReservaInvitado() {
    // Validaciones básicas
    if (!this.validarNombre(this.nombreInvitado)) {
      this.showModal('Nombre inválido','Introduce un nombre válido','error-modal');
      return;
    }
    if (!this.validarNombre(this.apellidoInvitado)) {
      this.showModal('Apellido inválido','Introduce un apellido válido','error-modal');
      return;
    }
    if (!this.validarEmail(this.emailInvitado)) {
      this.showModal('Correo inválido','Introduce un email válido','error-modal');
      return;
    }
    if (!this.validarTelefono(this.telefonoInvitado)) {
      this.showModal('Teléfono inválido','Introduce un teléfono válido','error-modal');
      return;
    }

    // Cerramos modal de datos
    this.showFormularioReserva = false;

    // Guardar la reserva directamente en backend y local
    this.enviarReservasBackend(true); // isInvitado = true
  }
  private enviarReservasBackend(isInvitado: boolean = false) {
    const email = isInvitado ? this.emailInvitado : localStorage.getItem('email') || '';
    const nombreCompleto = isInvitado
      ? `${this.nombreInvitado} ${this.apellidoInvitado}`
      : email;

    const reservas = this.calendarioSeleccionado.map(celda => {
      const inicioSemana = new Date(this.semanaSeleccionada.split('_to_')[0]);
      const diaIndex = this.dias.indexOf(celda.dia);

      const fechaReal = new Date(inicioSemana);
      fechaReal.setDate(inicioSemana.getDate() + diaIndex);
      const fechaFormateada = fechaReal.toISOString().split('T')[0];

      return {
        asignatura: this.asignaturaSeleccionada,
        nivel: this.nivelSeleccionado,
        modalidad: this.modalidadSeleccionada,
        bono: this.bonoSeleccionado,
        fechaClase: fechaFormateada,
        hora: celda.hora,
        estado: 'Pendiente',
        nombre: isInvitado ? this.nombreInvitado : nombreCompleto,
        apellidos: isInvitado ? this.apellidoInvitado : '',
        email: email,
        telefono: isInvitado ? this.telefonoInvitado : undefined,
        semana: this.semanaSeleccionada
      };
    });

    console.log('🔥 RESERVA A ENVIAR:', reservas[0]);
    if (reservas.length > 1) {
      this.showModal('Aviso', 'Solo puedes reservar una clase a la vez', 'error-modal');
      return;
    }

    const headers = { 'Content-Type': 'application/json' };

    // ✅ Intentamos guardar en backend
    this.http.post('https://tfg-musicallyx.onrender.com/v1/api/reservas', reservas[0], { headers })
      .subscribe({
        next: () => {
          // Actualizamos la celda del usuario y el resto del calendario
          this.actualizarEstadoCalendario(reservas[0]);
          this.actualizarCalendarioGlobal(); // <--- esto asegura que todo se vea bloqueado
          this.calendarioSeleccionado = [];
          this.showPostReservaModal = true;
        },
        error: () => {
          console.warn('Backend no disponible → guardando en localStorage');
          const reservasLocal = JSON.parse(localStorage.getItem('reservas-pendientes') || '[]');
          reservasLocal.push(reservas[0]);
          localStorage.setItem('reservas-pendientes', JSON.stringify(reservasLocal));

          this.actualizarEstadoCalendario(reservas[0]);
          this.actualizarCalendarioGlobal(); // <--- también aquí
          this.showPostReservaModal = true;
        }
      });
  }
  private actualizarEstadoCalendario(reserva: any) {
    const filaIndex = this.horas.indexOf(reserva.hora);
    const fechaInicio = this.parseDateOnly(this.semanaSeleccionada.split('_to_')[0]);
    const fechaStr = (reserva.fechaClase || reserva.fechaReserva || reserva.fecha);
    if (!fechaStr) return;
    const fechaRes = this.parseDateOnly(fechaStr?.split('T')[0]);
    const diaIndex = Math.floor(
      (fechaRes.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (filaIndex < 0 || diaIndex < 0 || diaIndex >= this.dias.length) {
      console.warn('❌ Reserva inválida:', reserva);
      return;
    }

    if (!this.calendario[filaIndex] || !this.calendario[filaIndex][diaIndex]) return;

    const emailUsuario = localStorage.getItem('email') || '';

    if (reserva.email === emailUsuario) {
      // Para quien hizo la reserva
      this.calendario[filaIndex][diaIndex].estado = 'reservado';
      this.calendario[filaIndex][diaIndex].texto =
        `Tu clase: ${reserva.asignatura} - ${reserva.nombre} ${reserva.apellidos} - ${reserva.fechaClase}`;
    } else {
      // Para todos los demás → bloqueada
      this.calendario[filaIndex][diaIndex].estado = 'no-disponible';
      this.calendario[filaIndex][diaIndex].texto = 'Clase reservada';
    }
  }

  private marcarReservas() {
    const reservasPendientes: any[] = JSON.parse(localStorage.getItem('reservas-pendientes') || '[]');
    const reservasConfirmadas: any[] = JSON.parse(localStorage.getItem('reservas-confirmadas') || '[]');
    const reservasGlobales = [...reservasPendientes, ...reservasConfirmadas];

    const emailUsuario = localStorage.getItem('email') || '';

    reservasGlobales.forEach(reserva => {
      const filaIndex = this.horas.indexOf(reserva.hora);
      const fechaStr = (reserva.fechaClase || reserva.fechaReserva || reserva.fecha);
      if (!fechaStr) return;
      const fechaRes = this.parseDateOnly(fechaStr?.split('T')[0]);
      const fechaInicio = this.parseDateOnly(this.semanaSeleccionada.split('_to_')[0]);

      const diaIndex = Math.floor(
        (fechaRes.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (filaIndex < 0 || diaIndex < 0) return;

      this.calendario[filaIndex][diaIndex].estado = reserva.email === emailUsuario ? 'reservado' : 'no-disponible';
      this.calendario[filaIndex][diaIndex].texto = reserva.email === emailUsuario ? `Tu clase: ${reserva.asignatura}` : 'Clase reservada';
    });
  }

  private actualizarCalendarioGlobal() {
    const reservasPendientes: any[] = JSON.parse(localStorage.getItem('reservas-pendientes') || '[]');
    const reservasConfirmadas: any[] = JSON.parse(localStorage.getItem('reservas-confirmadas') || '[]');
    const reservasGlobales = [...reservasPendientes, ...reservasConfirmadas];

    const emailUsuario = localStorage.getItem('email') || '';

    reservasGlobales.forEach(reserva => {
      const filaIndex = this.horas.indexOf(reserva.hora);
      const fechaInicioSemana = this.parseDateOnly(this.semanaSeleccionada.split('_to_')[0]);
      const fechaStr = (reserva.fechaClase || reserva.fechaReserva || reserva.fecha);
      if (!fechaStr) return;
      if (!fechaStr) {
        console.warn('❌ fechaStr inválida:', reserva);
        return;
      }
      const [y, m, d] = fechaStr.split('-').map(Number);
      const fechaRes = this.parseDateOnly(fechaStr);
      const diaIndex = Math.floor(
        (fechaRes.getTime() - fechaInicioSemana.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (!this.calendario[filaIndex] || !this.calendario[filaIndex][diaIndex]) return;

      // Bloquear la celda para todos
      this.calendario[filaIndex][diaIndex].estado = 'no-disponible';
      this.calendario[filaIndex][diaIndex].texto = 'Clase reservada';

      // Usuario que reservó la ve como "reservado"
      if (reserva.email === emailUsuario) {
        this.calendario[filaIndex][diaIndex].estado = 'reservado';
        this.calendario[filaIndex][diaIndex].texto = `Tu clase: ${reserva.asignatura}`;
      }
    });
  }
  getClasesPendientes(emailUsuario: string): any[] {
    const reservasPendientes: any[] = JSON.parse(localStorage.getItem('reservas-pendientes') || '[]');
    return reservasPendientes.filter(r => r.email === emailUsuario);
  }

  // Validaciones
  validarNombre(nombre: string): boolean { return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(nombre.trim()); }
  validarEmail(email: string): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()); }
  validarTelefono(tel: string): boolean { return /^(\+\d{1,3}\s?)?\d{9}$/.test(tel.trim()); }

  // Navegación y modales
  goToLogin() { this.router.navigate(['/iniciar-sesion']); }
  logout() { this.authService.logout(); this.router.navigate(['/iniciar-sesion']); }

  cerrarPostReserva() {
    this.showPostReservaModal = false;

    // Actualizamos estado de todas las reservas (reserva propia se vuelve "reservado")
    this.actualizarCalendarioGlobal();

    // Limpiamos la selección de nuevas celdas
    this.calendarioSeleccionado = [];
  }

  anteriorSemana() { const idx=this.semanas.findIndex(s=>s.key===this.semanaSeleccionada); if(idx>0){this.semanaSeleccionada=this.semanas[idx-1].key; this.actualizarSemanaActual();}}
  siguienteSemana() { const idx=this.semanas.findIndex(s=>s.key===this.semanaSeleccionada); if(idx<this.semanas.length-1){this.semanaSeleccionada=this.semanas[idx+1].key; this.actualizarSemanaActual();}}
  actualizarSemanaActual() { this.semanaActual = new Date(this.semanaSeleccionada.split('_to_')[0]); this.crearCalendario(); }
  toggleDia(idx: number) { this.diaAbierto = this.diaAbierto === idx ? null : idx; }
  cambiarSemana() { this.crearCalendario(); }

  irARegistro(): void {
    // Guardamos los datos actuales del invitado en localStorage
    localStorage.setItem('registroTemporal', JSON.stringify({
      nombre: this.nombreInvitado + ' ' + this.apellidoInvitado,
      apellido: this.apellidoInvitado,
      email: this.emailInvitado,
      telefono: this.telefonoInvitado
    }));

    // Redirigir a la página de registro
    this.router.navigate(['/registrarse']);
  }
}
