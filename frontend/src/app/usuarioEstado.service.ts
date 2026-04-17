import {Usuario} from './usuario.model';
import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UsuarioEstadoService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuarioSubject.next(JSON.parse(usuarioGuardado));
    }
  }

  setUsuario(usuario: Usuario) {
    this.usuarioSubject.next(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario)); // sincroniza siempre
  }

  getUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }
}
