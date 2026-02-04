import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Chat {
  id: number;
  emisor: string;    // email del emisor
  receptor: string;  // email del receptor
  texto: string;
  fechaEnvio: string;
  leido: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChatService {

  private baseUrl = '/api/mensajes';

  constructor(private http: HttpClient) {}

  enviarMensaje(emisor: string, receptor: string, texto: string): Observable<Chat> {
    const body = { emisor, receptor, texto };
    return this.http.post<Chat>(`http://localhost:8080/api/mensajes/enviar`, body);
  }

  obtenerChats(usuario1: string, usuario2: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.baseUrl}/chat`, { params: { usuario1Email: usuario1, usuario2Email: usuario2 } });
  }

  marcarLeido(mensajeId: number): Observable<Chat> {
    return this.http.put<Chat>(`${this.baseUrl}/leido/${mensajeId}`, {});
  }
}
