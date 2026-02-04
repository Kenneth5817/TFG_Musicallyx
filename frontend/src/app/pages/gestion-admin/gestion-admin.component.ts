import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdenarPipe } from '../../ordenar.pipe';
import { EmailService } from '../../services/email.service';
import { HttpClient } from '@angular/common/http';
import { Reserva } from '../../models/reserva.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-gestion-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, OrdenarPipe],
  templateUrl: './gestion-admin.component.html',
  styleUrls: ['./gestion-admin.component.css']
})
export class GestionAdminComponent implements OnInit {

  ordenarPor: 'alumno' | 'fecha' | 'asignatura' = 'fecha';
  reservasPendientes: Reserva[] = [];
  reservasConfirmadas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  buscarPor: 'alumno' | 'asignatura' = 'alumno';
  filtro: string = '';

  private baseUrl = 'http://localhost:8080/api/reservas';

  constructor(
    private emailService: EmailService,
    private cd: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.cargarReservasPendientes();
    this.cargarReservasConfirmadas();
  }

  /** -------------------- CARGAR RESERVAS -------------------- */
  cargarReservasPendientes() {
    this.http.get<Reserva[]>(`${this.baseUrl}/pendientes`).pipe(
      catchError(err => {
        console.warn('Backend no disponible, usando localStorage para pendientes', err);
        const pendientes = JSON.parse(localStorage.getItem('reservas-pendientes') || '[]');
        return of(pendientes);
      })
    ).subscribe(reservas => {
      if (reservas) {
        this.reservasPendientes = reservas.map((r: Reserva) => ({...r, fechaReserva: new Date(r.fechaReserva)}));
      }
    });
  }

  cargarReservasConfirmadas() {
    this.http.get<Reserva[]>(`${this.baseUrl}/confirmadas`).pipe(
      catchError(err => {
        console.warn('Backend no disponible, usando localStorage para confirmadas', err);
        const confirmadas = JSON.parse(localStorage.getItem('reservas-confirmadas') || '[]');
        return of(confirmadas);
      })
    ).subscribe(reservas => {
      if (reservas) {
        this.reservasConfirmadas = reservas.map((r:Reserva) => ({...r, fechaReserva: new Date(r.fechaReserva)}));
      }
      this.filtrarConfirmadas();
    });
  }

  confirmarReserva(reserva: Reserva) {
    this.http.post<Reserva>(`${this.baseUrl}/confirmar`, reserva).pipe(
      catchError(() => {
        // 1️⃣ Quitar de pendientes del admin y añadir a confirmadas
        this.reservasPendientes = this.reservasPendientes.filter(r => r !== reserva);
        const confirmada = { ...reserva, estado: 'Confirmada' };
        this.reservasConfirmadas.push(confirmada);

        // 2️⃣ Guardar en localStorage global
        localStorage.setItem('reservas-pendientes', JSON.stringify(this.reservasPendientes));
        localStorage.setItem('reservas-confirmadas', JSON.stringify(this.reservasConfirmadas));

        // 3️⃣ Actualizar reservas del usuario
        const email = reserva.email;
        const reservasUsuario: any[] = JSON.parse(localStorage.getItem(`reservas-${email}`) || '[]');
        reservasUsuario.forEach(r => {
          if (r.hora === reserva.hora) {
            r.estado = 'Confirmada';
          }
        });
        localStorage.setItem(`reservas-${email}`, JSON.stringify(reservasUsuario));

        return of(confirmada);
      })
    ).subscribe(res => {
      // 4️⃣ Recargar listas del admin
      this.cargarReservasPendientes();
      this.cargarReservasConfirmadas();

      // 5️⃣ Preparar DTO explícito para enviar al backend
      const reservaDTO = {
        alumno: res.alumno,
        email: res.email,
        asignatura: res.asignatura,
        fecha: res.fechaReserva.toISOString(), // formato que el backend entiende
        hora: res.hora || res.horario // ⚡ aquí aseguramos que la hora correcta se envíe
      };

      // 6️⃣ Enviar correo al usuario confirmando la reserva
      this.emailService.enviarCorreoConfirmacion(reservaDTO).subscribe({
        next: () => console.log('Correo enviado correctamente'),
        error: err => console.error('Error enviando correo', err)
      });
    });
  }




  rechazarReserva(reserva: Reserva) {
    this.http.post(`${this.baseUrl}/rechazar`, reserva).pipe(
      catchError(err => {
        this.reservasPendientes = this.reservasPendientes.filter(r => r !== reserva);
        localStorage.setItem('reservas-pendientes', JSON.stringify(this.reservasPendientes));

        const email = reserva.email;
        const reservasUsuario = JSON.parse(localStorage.getItem(`reservas-${email}`) || '[]');
        const nuevas = reservasUsuario.filter((r:any) => r.hora !== reserva.hora);
        localStorage.setItem(`reservas-${email}`, JSON.stringify(nuevas));

        return of(null);
      })
    ).subscribe(() => this.cargarReservasPendientes());
  }


  devolverAPendientes(reserva: Reserva) {
    // 1️⃣ Quitar de confirmadas del admin y añadir a pendientes
    this.reservasConfirmadas = this.reservasConfirmadas.filter(r => r !== reserva);
    const pendiente = { ...reserva, estado: 'Pendiente' };
    this.reservasPendientes.push(pendiente);

    // 2️⃣ Guardar en localStorage global
    localStorage.setItem('reservas-confirmadas', JSON.stringify(this.reservasConfirmadas));
    localStorage.setItem('reservas-pendientes', JSON.stringify(this.reservasPendientes));

    // 3️⃣ Actualizar reservas del usuario
    const email = reserva.email;
    const reservasUsuario: any[] = JSON.parse(localStorage.getItem(`reservas-${email}`) || '[]');
    reservasUsuario.forEach(r => {
      if (r.horario === reserva.horario) {
        r.estado = 'Pendiente';
      }
    });
    localStorage.setItem(`reservas-${email}`, JSON.stringify(reservasUsuario));

    // 4️⃣ Recargar listas del admin
    this.cargarReservasPendientes();
    this.cargarReservasConfirmadas();
  }



  eliminarConfirmada(reserva: Reserva) {
    this.http.delete(`${this.baseUrl}/confirmadas/${reserva.email}/${reserva.asignatura}/${reserva.hora}`).pipe(
      catchError(err => {
        // Quitar de confirmadas del admin
        this.reservasConfirmadas = this.reservasConfirmadas.filter(r => r !== reserva);
        localStorage.setItem('reservas-confirmadas', JSON.stringify(this.reservasConfirmadas));

        const email = reserva.email;
        const reservasUsuario = JSON.parse(localStorage.getItem(`reservas-${email}`) || '[]');
        const nuevas = reservasUsuario.filter((r:any) => r.hora !== reserva.hora);
        localStorage.setItem(`reservas-${email}`, JSON.stringify(nuevas));

        const bloqueosSemana = JSON.parse(localStorage.getItem(reserva.semana) || '{}');
        delete bloqueosSemana[reserva.hora];
        localStorage.setItem(reserva.semana, JSON.stringify(bloqueosSemana));

        return of(null);
      })
    ).subscribe(() => this.cargarReservasConfirmadas());
  }


  filtrarConfirmadas() {
    if (!this.filtro.trim()) {
      this.reservasFiltradas = [...this.reservasConfirmadas];
      return;
    }
    const filtroLower = this.filtro.toLowerCase();
    this.reservasFiltradas = this.reservasConfirmadas.filter(r =>
      (r[this.buscarPor] || '').toLowerCase().includes(filtroLower)
    );
  }

}


