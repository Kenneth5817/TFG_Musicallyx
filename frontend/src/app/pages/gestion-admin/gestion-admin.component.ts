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

  private baseUrl = 'https://tfg-musicallyx.onrender.com/v1/api/reservas';

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
      console.log("📦 CONFIRMADAS RAW BACKEND:", reservas);
      if (reservas) {
        this.reservasConfirmadas = reservas.map((r:Reserva) => ({...r, fechaReserva: new Date(r.fechaReserva)}));
      }
      this.filtrarConfirmadas();
    });
  }

  confirmarReserva(reserva: Reserva) {
    this.http.put<Reserva>(`${this.baseUrl}/confirmar/${reserva.idReserva}`, reserva)
      .subscribe({
        next: (res:any) => {
          console.log("🔥 RESPUESTA BACKEND:", res);

          // 🔄 Recargar datos reales desde backend
          this.cargarReservasPendientes();
          this.cargarReservasConfirmadas();

          // 📧 Enviar email
          const reservaDTO = {
            alumno: (res.nombre ?? res.nombreAlumno ?? '') + " " + (res.apellidos ?? ''),
            email: res.email,
            asignatura: res.asignatura,
            fecha: res.fechaClase
              ? new Date(res.fechaClase).toISOString().split('T')[0]
              : new Date(res.fechaReserva).toISOString().split('T')[0],
            hora: res.hora
          };

          this.emailService.enviarCorreoConfirmacion(reservaDTO).subscribe({
            next: () => console.log("📧 Email de confirmación enviado"),
            error: err => console.error("❌ Error enviando email", err)
          });

        },
        error: err => {
          console.error('❌ Error confirmando reserva', err);
        }
      });
  }

  rechazarReserva(reserva: Reserva) {
    const url = `${this.baseUrl}/${reserva.idReserva}`; // asumimos que cada reserva tiene un id único
    this.http.delete(url).pipe(
      catchError(err => {
        console.warn('Backend no disponible, eliminando localmente', err);

        // Quitar de pendientes del admin
        this.reservasPendientes = this.reservasPendientes.filter(r => r !== reserva);
        localStorage.setItem('reservas-pendientes', JSON.stringify(this.reservasPendientes));

        // Quitar del usuario
        const email = reserva.email;
        const reservasUsuario = JSON.parse(localStorage.getItem(`reservas-${email}`) || '[]');
        const nuevas = reservasUsuario.filter((r: any) => r.id !== reserva.idReserva);
        localStorage.setItem(`reservas-${email}`, JSON.stringify(nuevas));

        return of(null);
      })
    ).subscribe(() => {
      // Refrescar vista de pendientes
      this.cargarReservasPendientes();
    });
  }


  devolverAPendientes(reserva: Reserva) {
    this.http.put<Reserva>(`${this.baseUrl}/pendiente/${reserva.idReserva}`, reserva)
      .subscribe(res => {
        // Quitar de confirmadas
        this.reservasConfirmadas = this.reservasConfirmadas.filter(r => r.idReserva !== reserva.idReserva);

        // Añadir a pendientes
        this.reservasPendientes.push(res);

        // Actualizar localStorage (opcional)
        localStorage.setItem('reservas-pendientes', JSON.stringify(this.reservasPendientes));
        localStorage.setItem('reservas-confirmadas', JSON.stringify(this.reservasConfirmadas));

        // Refrescar listas filtradas
        this.filtrarConfirmadas();
      }, err => {
        console.error('Error devolviendo reserva a pendientes', err);
      });
  }

  eliminarConfirmada(reserva: Reserva) {
    this.http.delete(`${this.baseUrl}/${reserva.idReserva}`).pipe(
      catchError(err => {
        console.warn('Backend no disponible', err);

        this.reservasConfirmadas =
          this.reservasConfirmadas.filter(r => r.idReserva !== reserva.idReserva);

        localStorage.setItem('reservas-confirmadas', JSON.stringify(this.reservasConfirmadas));

        return of(null);
      })
    ).subscribe(() => {
      this.reservasConfirmadas =
        this.reservasConfirmadas.filter(r => r.idReserva !== reserva.idReserva);

      this.filtrarConfirmadas(); // 👈 IMPORTANTE
    });
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


