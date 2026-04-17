// src/app/services/usuario-estado.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioEstadoService {
  // Iniciamos con lo que haya en localStorage o un usuario vacío
  private _usuario$ = new BehaviorSubject<Usuario>(
    JSON.parse(localStorage.getItem('usuario')!) || { idUsuario: 0, nombre: '', email: '', rol: 'USER' }
  );

  // Observable público
  usuario$ = this._usuario$.asObservable();

  // Método para actualizar usuario
  setUsuario(usuario: Usuario) {
    this._usuario$.next(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }
}
