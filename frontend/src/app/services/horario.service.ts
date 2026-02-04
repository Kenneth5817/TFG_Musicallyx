import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HorarioBackend {
  idHorario: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

@Injectable({ providedIn: 'root' })
export class HorarioService {
  private baseUrl = 'http://localhost:8080/v1/api/horarios';

  constructor(private http: HttpClient) {}

  getHorarios(): Observable<HorarioBackend[]> {
    return this.http.get<HorarioBackend[]>(this.baseUrl);
  }

  updateHorario(id: number, patch: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, patch);
  }
}
