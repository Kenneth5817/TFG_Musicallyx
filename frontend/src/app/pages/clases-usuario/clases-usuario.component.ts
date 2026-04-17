import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Clase {
  nombre: string;
  color: string;
  ruta: string;
  icono: string;
  descripcion: string;
  descCorta: string;
}

@Component({
  selector: 'app-clases-usuario',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './clases-usuario.component.html',
  styleUrls: ['./clases-usuario.component.css']
})
export class ClasesUsuarioComponent {

  selectedClase: Clase | null = null;

  openClase(clase: Clase) {
    this.selectedClase = clase;
  }

  closeClase() {
    this.selectedClase = null;
  }

  clases: Clase[] = [
    {
      nombre: 'Composición',
      color: '#00d4ff',
      ruta: '/reserva-clases',
      icono: '🎼',
      descripcion:
        `Aprende a crear música original desde cero, desarrollando tu propia voz artística.
Explora armonía, melodía y ritmo para construir piezas coherentes y expresivas.
Estudia diferentes géneros y estilos musicales para ampliar tu vocabulario creativo.
Descubre técnicas para motivar emociones a través de tus obras.
Trabaja con arreglos y orquestación, adaptando tu música a distintos formatos.
Al final del curso, podrás presentar tus propias obras con confianza.`,
      descCorta: 'Crea música original y desarrolla tu creatividad.'
    },
    {
      nombre: 'Piano',
      color: '#006bff',
      ruta: '/reserva-clases',
      icono: '🎹',
      descripcion:
        `Domina la técnica del piano paso a paso, desde principiante hasta avanzado.
Aprenderás a tocar escalas, arpegios y acordes de manera fluida.
Explora diferentes géneros, desde clásico hasta jazz y pop.
Desarrollarás coordinación entre ambas manos y control del pedal.
Estudia repertorio icónico y piezas modernas adaptadas a tu nivel.
Al finalizar, podrás tocar piezas completas con confianza y estilo.`,
      descCorta: 'Mejora tu técnica y domina el piano.'
    },
    {
      nombre: 'Armonía',
      color: '#00c981',
      ruta: '/reserva-clases',
      icono: '✍️',
      descripcion:
        `Comprende cómo se construye y organiza la música a nivel vertical.
Estudiarás acordes, tonalidades, funciones armónicas y progresiones.
Aprenderás a analizar obras musicales desde su estructura armónica.
Desarrollarás la capacidad de escribir y reconocer secuencias armónicas correctamente.
Al finalizar, entenderás el lenguaje armónico y podrás aplicarlo en tus interpretaciones y composiciones.`,
      descCorta: 'Entiende cómo se construyen los acordes y la música.'
    },
    {
      nombre: 'Lenguaje Musical',
      color: '#ffc400',
      ruta: '/reserva-clases',
      icono: '📖',
      descripcion:
        `Comprende las bases teóricas que sustentan toda la música.
Estudia ritmo, compases, notas, escalas y tonalidades.
Aprenderás a leer partituras con fluidez y precisión.
Profundiza en armonía, cadencias y modulación entre tonalidades.
Al final del curso, comprenderás cómo funciona la música desde dentro.`,
      descCorta: 'Domina las bases teóricas de la música.'
    },
    {
      nombre: 'Análisis Partituras',
      color: '#ff6600',
      ruta: '/reserva-clases',
      icono: '📊',
      descripcion:
        `Aprende a estudiar partituras y comprender la intención del compositor.
Descubre estructuras, formas y técnicas utilizadas en obras clásicas y modernas.
Aprenderás a identificar motivos, temas y variaciones.
Desarrolla habilidades de crítica y evaluación de obras musicales.
Al finalizar, podrás leer y comprender partituras complejas con confianza.`,
      descCorta: 'Comprende cómo están construidas las obras.'
    },
    {
      nombre: 'Improvisación al Piano',
      color: '#9d00ff',
      ruta: '/reserva-clases',
      icono: '✨',
      descripcion:
        `Desarrolla creatividad y libertad al improvisar en diferentes estilos.
Aprenderás escalas, arpegios y acordes para improvisar fluidamente.
Explora géneros como jazz, blues, pop y clásico.
Recibirás ejercicios prácticos para superar bloqueos creativos.
Al finalizar, podrás crear piezas originales en tiempo real con seguridad.`,
      descCorta: 'Improvisa con fluidez y estilo propio.'
    },

    {
      nombre: 'Informática Musical',
      color: '#3c3c3c',
      ruta: '/reserva-clases',
      icono: '💻',
      descripcion:
        `Aprende a utilizar herramientas digitales para apoyar tu formación musical.
Trabajarás con software de grabación de audio para registrar y revisar tus interpretaciones.
Explorarás la edición básica de partituras y el uso de programas de notación musical.
Desarrollarás habilidades para organizar, escribir y mejorar tus ideas musicales en formato digital.
Al finalizar, serás capaz de utilizar la informática como apoyo práctico en tu estudio musical diario.`,
      descCorta: 'Graba, edita partituras y mejora tu estudio musical.'
    },

    {
      nombre: 'Canto',
      color: '#ff3b6b',
      ruta: '/reserva-clases',
      icono: '🎤',
      descripcion:
        `Desarrolla tu voz como instrumento musical a través de técnica y expresión.
Trabajarás la respiración, afinación, proyección y control vocal.
Aprenderás a interpretar canciones con seguridad y emoción.
Al finalizar, habrás mejorado tu técnica vocal y tu capacidad interpretativa.`,
      descCorta: 'Mejora tu técnica vocal e interpretación.'
    }
  ];
}


