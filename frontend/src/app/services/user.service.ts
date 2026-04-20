import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Usuario } from '../usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  /**
   * Devuelve todos los usuarios registrados, extrayendo el array 'content'
   * de la respuesta paginada del backend.
   */
  private apiUrl = 'https://tfg-musicallyx.onrender.com/v1/api/usuarios';

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(page => page.content || [])
    );
  }

  updateUsuario(id: number, datos: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, datos);
  }

  getUsuarioByEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/email/${email}`);
  }
}
