import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Reserva} from '../models/reserva.model';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private baseUrl = 'http://localhost:8080/api/email';

  constructor(private http: HttpClient) {}

  enviarCorreoConfirmacion(reserva: {
    fecha: string;
    asignatura: string;
    hora: string | undefined;
    alumno: string;
    email: string
  }): Observable<string> {
    // ruta completa al endpoint correcto
    return this.http.post(`${this.baseUrl}/confirmacion`, reserva, { responseType: 'text' });
  }

  suscribirse(email: string): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/suscribirse`,
      { email },
      { responseType: 'text' }
    );
  }

}
