import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Usuario {
  nombre: string;
  email: string;
  apellido:string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  /**
   * Devuelve todos los usuarios registrados, extrayendo el array 'content'
   * de la respuesta paginada del backend.
   */
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<any>('http://localhost:8080/v1/api/usuarios').pipe(
      map(page => page.content || []) // Extrae el array real de usuarios
    );
  }
  updateUsuario(usuario: any) {
    return this.http.put(`http://localhost:8080/v1/api/usuarios/${usuario.idUsuario}`, usuario);
  }

}
