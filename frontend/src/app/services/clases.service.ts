import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Clase {
  idClase: number;
  nombreClase: string;
  descripcion: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  precio: number;
  modalidad: string;
  dificultad: string;
  reservas?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private apiUrl = 'http://localhost:8080/v1/api/clases';

  constructor(private http: HttpClient) { }

  getClases(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}`);
  }
}
