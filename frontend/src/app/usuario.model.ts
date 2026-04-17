// src/app/models/usuario.model.ts
export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido?: string;
  email: string;
  telefono?: string;
  nivelMusical?: string;
  gustosMusicales?: string;
  rol?: 'ADMIN' | 'USER';
}
