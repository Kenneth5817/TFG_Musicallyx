import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ResultadoBusqueda {
  tipo: string;
  titulo: string;
  ruta: string;
}

@Injectable({
  providedIn: 'root'
})
export class BuscarService {
  private datos: ResultadoBusqueda[] = [
    // Clases
    { tipo: 'Clase', titulo: 'Clases', ruta: '/clases' },
    { tipo: 'Clase', titulo: 'Reservar clase', ruta: '/reserva-clases' },
    { tipo: 'Clase', titulo: 'Piano', ruta: '/clases' },
    { tipo: 'Clase', titulo: 'Lenguaje Musical', ruta: '/reserva-clases' },
    { tipo: 'Clase', titulo: 'Canto', ruta: '/reserva-clases' },
    { tipo: 'Clase', titulo: 'Letrista', ruta: '/reserva-clases' },
    { tipo: 'Clase', titulo: 'Producción Musical', ruta: '/reserva-clases' },
    { tipo: 'Clase', titulo: 'Composición', ruta: '/reserva-clases' },


    // Juegos
    { tipo: 'Juego', titulo: 'Juegos Musicales', ruta: '/juegos-musicales' },

    // Información
    { tipo: 'Info', titulo: 'Sobre mi', ruta: '/info' },

    // Usuario
    { tipo: 'Usuario', titulo: 'Iniciar sesión', ruta: '/iniciar-sesion' },
    { tipo: 'Usuario', titulo: 'Registrarse', ruta: '/registrarse' }
  ];

  constructor() { }

  buscar(termino: string): ResultadoBusqueda[] {
    return this.datos.filter(item =>
      item.titulo.toLowerCase().includes(termino.toLowerCase())
    );
  }
}
