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
      nombre: 'Producción Musical',
      color: '#ff0033',
      ruta: '/reserva-clases',
      icono: '🎛️',
      descripcion:
        `Aprende a crear música profesional usando software de producción.
Estudia mezcla, mastering y diseño de sonido desde cero.
Explora técnicas de grabación y edición para instrumentos y voces.
Desarrolla tu oído para balancear frecuencias y lograr mezclas limpias.
Aprenderás a organizar tu flujo de trabajo y mejorar tu productividad.
Al final del curso, tendrás pistas listas para distribuir profesionalmente.`,
      descCorta: 'Crea música con calidad profesional.'
    },
    {
      nombre: 'Letrista',
      color: '#00c981',
      ruta: '/reserva-clases',
      icono: '✍️',
      descripcion:
        `Aprende a escribir letras que conecten con emociones y experiencias.
Explora estructuras de canciones y cómo contar historias efectivas.
Estudia métrica, rima y recursos poéticos aplicados a la música.
Analizarás letras de referencia para inspirarte y aprender técnicas.
Recibirás retroalimentación profesional sobre tus creaciones.
Al finalizar, podrás escribir letras completas para canciones con impacto.`,
      descCorta: 'Aprende a escribir letras impactantes.'
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
    }
  ];
}


