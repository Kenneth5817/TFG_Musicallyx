import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin, interval, Subscription } from 'rxjs';

interface Celda {
  dia: string;
  hora: string;
  estado: 'disponible' | 'reservado' | 'no-disponible' | 'seleccionado';
  texto?: string;
  fecha?: string;
}

@Component({
  selector: 'app-bloqueo-horario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bloqueo-horario.component.html',
  styleUrls: ['./bloqueo-horario.component.css'],
})
export class BloqueoHorarioComponent implements OnInit, OnDestroy {

  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  horas = [
    '9:00-10:00','10:00-11:00','11:00-12:00','12:00-13:00',
    '16:00-17:00','17:00-18:00','18:00-19:00','19:00-20:00','20:00-21:00'
  ];

  semanas: { key: string, label: string }[] = [];
  semanaSeleccionada = '';

  guardando = false;
  private syncSub?: Subscription;

  private calendarioMap = new Map<string, Celda>();

  // 🔥 NUEVO: selección real
  seleccionadas = new Set<string>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.generarSemanas();
    this.semanaSeleccionada = this.semanas[2].key;

    this.generarCalendarioBase();

    this.aplicarBloqueoInicial();
    this.cargarDesdeBackend();

    //this.syncSub = interval(15000).subscribe(() => {
    //  if (!this.guardando) this.cargarDesdeBackend();
    //});
  }

  ngOnDestroy() {
    this.syncSub?.unsubscribe();
  }

  private key(fecha: string, hora: string): string {
    return `${fecha}|${hora}`;
  }

  private normalizarFecha(fecha: any): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return String(fecha).split('T')[0];
    return d.toISOString().split('T')[0];
  }

  generarSemanas() {
    const today = new Date();
    this.semanas = [];

    for (let i = -2; i < 3; i++) {
      const start = new Date(today);
      start.setDate(start.getDate() + i * 7 - start.getDay() + 1);

      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      this.semanas.push({
        key: `${start.toISOString().split('T')[0]}_to_${end.toISOString().split('T')[0]}`,
        label: `${start.getDate()} ${start.toLocaleString('es', { month: 'long' })} - ${end.getDate()} ${end.toLocaleString('es', { month: 'long' })}`
      });
    }
  }

  onCeldaClick(celda: Celda, event: MouseEvent) {
    // click normal = selección/bloqueo solo si NO es reservada
    if (celda.estado === 'reservado') return;

    this.toggleSeleccion(celda);
  }

  private toggleSeleccion(celda: Celda) {
    const k = this.key(celda.fecha!, celda.hora);

    if (this.seleccionadas.has(k)) {
      this.seleccionadas.delete(k);
      celda.estado = 'disponible';
    } else {
      this.seleccionadas.add(k);
      celda.estado = 'seleccionado';
    }
  }
  onCeldaDobleClick(celda: Celda, event: MouseEvent) {
    // SOLO admin: borrar reserva
    if (celda.estado !== 'reservado') return;

    const confirmacion = confirm('¿Eliminar esta reserva?');
    if (!confirmacion) return;

    const fecha = celda.fecha;
    if (!fecha) return;

    const k = this.key(fecha, celda.hora);

    // 🔥 llamada backend para borrar
    this.http.delete(
      `http://localhost:8080/v1/api/reservas`,
      {
        body: {
          fechaClase: fecha,
          hora: celda.hora
        }
      }
    ).subscribe({
      next: () => {
        // 🔥 actualizar UI instantáneo
        this.calendarioMap.set(k, {
          ...celda,
          estado: 'disponible',
          texto: undefined
        });

        console.log('Reserva eliminada ✔');
      },
      error: () => {
        alert('Error al eliminar la reserva ❌');
      }
    });
  }
  private aplicarBloqueoInicial() {

    const diasBloqueados = ['Lunes', 'Martes'];
    const mananasBloqueadas = ['9:00-10:00','10:00-11:00','11:00-12:00','12:00-13:00'];

    this.calendarioMap.forEach((celda, key) => {

      const esDiaBloqueado = diasBloqueados.includes(celda.dia);
      const esManana = mananasBloqueadas.includes(celda.hora);

      if (esDiaBloqueado) {
        celda.estado = 'no-disponible';
      }

      if (!esDiaBloqueado && esManana) {
        celda.estado = 'no-disponible';
      }

    });
  }
  generarCalendarioBase() {
    this.calendarioMap.clear();

    const [start] = this.semanaSeleccionada.split('_to_');
    const inicio = new Date(start);

    for (let d = 0; d < 5; d++) {
      const fecha = new Date(inicio);
      fecha.setDate(inicio.getDate() + d);

      const fechaStr = fecha.toISOString().split('T')[0];

      this.horas.forEach(hora => {
        const k = this.key(fechaStr, hora);

        this.calendarioMap.set(k, {
          dia: this.dias[d],
          hora,
          estado: 'disponible',
          fecha: fechaStr
        });
      });
    }
  }

  get calendario(): Celda[][] {
    const grid: Celda[][] = [];

    const [start] = this.semanaSeleccionada.split('_to_');
    const inicio = new Date(start);

    for (let i = 0; i < this.horas.length; i++) {
      const fila: Celda[] = [];

      for (let d = 0; d < 5; d++) {
        const fecha = new Date(inicio);
        fecha.setDate(inicio.getDate() + d);

        const fechaStr = fecha.toISOString().split('T')[0];
        const k = this.key(fechaStr, this.horas[i]);

        fila.push(this.calendarioMap.get(k)!);
      }

      grid.push(fila);
    }

    return grid;
  }

  // 🔥 CLICK FUNCIONANDO DE VERDAD
  toggleCelda(celda: Celda) {
    if (celda.estado === 'reservado') return;

    const fecha = celda.fecha || this.dias[this.calendario.findIndex(f => f.includes(celda))]; // fallback seguro
    if (!fecha) return;

    const k = this.key(celda.fecha!, celda.hora);

    if (this.seleccionadas.has(k)) {
      this.seleccionadas.delete(k);
      celda.estado = 'disponible';
    } else {
      this.seleccionadas.add(k);
      celda.estado = 'seleccionado';
    }
  }

  cargarDesdeBackend() {
    const [start, end] = this.semanaSeleccionada.split('_to_');

    forkJoin({
      reservas: this.http.get<any[]>(
        `http://localhost:8080/v1/api/reservas/semana/${this.semanaSeleccionada}`
      ),
      bloqueos: this.http.get<any[]>(
        `http://localhost:8080/v1/api/bloqueos/semana?start=${start}&end=${end}`
      )
    }).subscribe(({ reservas, bloqueos }) => {

      // 🔴 RESERVAS
      reservas.forEach(r => {
        const fecha = this.normalizarFecha(r.fechaClase);
        const k = this.key(fecha, r.hora);

        if (this.seleccionadas.has(k)) return; // 🔥 NO PISAR UI

        const celda = this.calendarioMap.get(k);
        if (!celda) return;

        this.calendarioMap.set(k, {
          ...celda,
          estado: 'reservado',
          texto: 'Clase reservada'
        });
      });

      // ⚫ BLOQUEOS
      bloqueos.forEach(b => {
        const fecha = this.normalizarFecha(b.fecha);
        const k = this.key(fecha, b.hora);

        if (this.seleccionadas.has(k)) return;

        const celda = this.calendarioMap.get(k);
        if (!celda) return;

        if (celda.estado === 'reservado') return;

        this.calendarioMap.set(k, {
          ...celda,
          estado: 'no-disponible'
        });
      });

    });
  }

  guardarCambios() {
    this.guardando = true;

    const bloqueos = Array.from(this.seleccionadas).map(k => {
      const [fecha, hora] = k.split('|');
      return {
        fecha,
        hora,
        disponible: false
      };
    });

    this.http.post('http://localhost:8080/v1/api/bloqueos', bloqueos)
      .subscribe({
        next: () => {
          alert('Cambios guardados ✔');
          this.seleccionadas.clear();
          this.cargarDesdeBackend();
          this.guardando = false;
        },
        error: () => {
          alert('Error al guardar ❌');
          this.guardando = false;
        }
      });
  }

  anteriorSemana() {
    const idx = this.semanas.findIndex(s => s.key === this.semanaSeleccionada);
    if (idx > 0) {
      this.semanaSeleccionada = this.semanas[idx - 1].key;
      this.generarCalendarioBase();
      this.aplicarBloqueoInicial();
      this.cargarDesdeBackend();
    }
  }

  siguienteSemana() {
    const idx = this.semanas.findIndex(s => s.key === this.semanaSeleccionada);
    if (idx < this.semanas.length - 1) {
      this.semanaSeleccionada = this.semanas[idx + 1].key;
      this.generarCalendarioBase();
      this.aplicarBloqueoInicial();
      this.cargarDesdeBackend();
    }
  }

  obtenerLabelSemanaActual(): string {
    return this.semanas.find(s => s.key === this.semanaSeleccionada)?.label || '';
  }
}
