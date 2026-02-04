import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ReservaTablaDTO} from './reservaTablaDTO';


@Injectable({ providedIn: 'root' })
export class AdminService {

  private baseUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  getDatos(tipo: string, page: number, size: number): Observable<any> {
    if (tipo === 'usuarios') {
      // Endpoint específico para usuarios
      return this.http.get<any>(`http://localhost:8080/v1/api/usuarios?page=${page}&size=${size}`,
      {withCredentials: true})
    }
    if (tipo === 'profesores') {
      return this.getProfesores(page, size);  // llamar a /v1/api/profesores
    }
    if (tipo === 'reservas') {
      return this.http.get<any>(
        `http://localhost:8080/v1/api/reservas?page=${page}&size=${size}`,
        { withCredentials: true }
      );
    }

    // Para otras categorías mantenemos la URL base
    return this.http.get<any>(`${this.baseUrl}/${tipo}?page=${page}&size=${size}`,
      {withCredentials: true});
  }

  getProfesores(page: number = 0, size: number = 10) {
    return this.http.get<any>(`http://localhost:8080/v1/api/profesores?page=${page}&size=${size}`, {
      withCredentials: true
    });
  }

  getDatosTablaReservas(pagina: number, tamaño: number): Observable<{content: ReservaTablaDTO[], totalPages: number, number: number}> {
    return this.http.get<{content: ReservaTablaDTO[], totalPages: number, number: number}>(
      `http://localhost:8080/v1/api/reservas/tabla?page=${pagina}&size=${tamaño}`,
      { withCredentials: true }
    );
  }
}


