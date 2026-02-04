// src/app/services/mensaje.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mensaje {
  id: number;
  emisor: string;
  receptor: string;
  asunto?: string;
  texto: string;
  fechaEnvio: string;
  leido: boolean;
}

@Injectable({ providedIn: 'root' })
export class MensajeService {
  private baseUrl = 'http://localhost:8080/api/mensajes';

  constructor(private http: HttpClient) {}

  enviarMensaje(emisor: string, receptor: string, asunto: string, texto: string): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.baseUrl}/enviar`, { emisor, receptor, asunto, texto });
  }

  obtenerRecibidos(usuario: string): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.baseUrl}/recibidos`, { params: { usuario } });
  }

  obtenerEnviados(usuario: string): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.baseUrl}/enviados`, { params: { usuario } });
  }

  marcarLeido(id: number): Observable<Mensaje> {
    return this.http.put<Mensaje>(`${this.baseUrl}/leido/${id}`, {});
  }

}
