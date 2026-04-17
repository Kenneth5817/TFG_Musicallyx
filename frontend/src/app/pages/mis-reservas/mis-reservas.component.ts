import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import {Reserva} from '../../models/reserva.model';

export interface PaypalResponse {
  href: string;
  orderId: string;
}
@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.css']
})
export class MisReservasComponent implements OnInit {
  reservasPendientes: Reserva[] = [];
  reservasConfirmadas: Reserva[] = [];
  filtro: string = '';

  constructor(private router: Router,  private http: HttpClient) {}

  ngOnInit() {
    const email = localStorage.getItem('email') || '';

    this.http.get<Reserva[]>(`http://localhost:8080/v1/api/reservas/usuario/${email}`)
      .subscribe(reservas => {

        const reservasNormalizadas = reservas.map(r => ({
          ...r,
          alumno: r.alumno || r.email,
          fechaReserva: new Date(r.fechaReserva),
          pagado: r.pagado ?? false,
          bono: r.bono || '',
          clase: r.clase ?? undefined
        }));

        this.reservasPendientes = reservasNormalizadas.filter(r => r.estado === 'Pendiente');
        this.reservasConfirmadas = reservasNormalizadas.filter(r => r.estado === 'Confirmada');
      });
  }

  filtrarConfirmadas() {
    // Por ahora sin filtro, puedes añadirlo como en GestionAdmin
  }

  mostrarOpcionesPago(reserva: Reserva) {
    reserva.mensajePago = "Redirigiendo a PayPal...";
    this.pagarPaypal(reserva);
  }

  pagarPaypal(reserva: Reserva) {
    const request = {
      method: 'PAYPAL',
      amount: Number(reserva.precio) || 14.00, // <--- Asegúrate de que sea number
      currency: 'EUR',
      description: `Pago clase ${reserva.asignatura}`
    };

    this.http.post<PaypalResponse>('http://localhost:8080/payment/create', request)
      .subscribe(resp => {
        // Redirige directamente al href de PayPal
        window.location.href = resp.href;
      }, err => {
        console.error(err);
        reserva.mensajePago = "Error al iniciar el pago. Inténtalo de nuevo.";
      });
  }
}


