import { Component } from '@angular/core';
import {EmailService} from '../../services/email.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [CommonModule, FormsModule]

})
export class FooterComponent {
  email = "";

  showFullScreenNotification = false;
  notificationType = '';
  notificationTitle = '';
  notificationMessage = '';

  mostrarNotificacion(tipo: 'success' | 'error', titulo: string, mensaje: string) {
    this.notificationType = tipo;
    this.notificationTitle = titulo;
    this.notificationMessage = mensaje;
    this.showFullScreenNotification = true;
  }

  closeNotification() {
    this.showFullScreenNotification = false;
  }


  constructor(private emailService: EmailService) {}

  suscribirse() {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(this.email)) {
      this.mostrarNotificacion(
        'error',
        'Email inválido',
        'Introduce un correo válido para continuar.'
      );
      return;
    }

    this.emailService.suscribirse(this.email).subscribe({
      next: (mensaje: string) => {
        this.mostrarNotificacion(
          'success',
          '¡Suscripción exitosa!',
          mensaje
        );
        this.email = '';
      },
      error: (err) => {
        if (err.status === 409) {
          this.mostrarNotificacion(
            'error',
            '¡Ups!',
            'Lo sentimos, ya estás suscrito. No puedes registrarte otra vez.'
          );
        } else {
          const mensajeServidor = err.error;
          this.mostrarNotificacion(
            'error',
            'Error',
            mensajeServidor || 'No pudimos completar tu suscripción. Intenta nuevamente.'
          );
        }
      }
    });
  }
}
