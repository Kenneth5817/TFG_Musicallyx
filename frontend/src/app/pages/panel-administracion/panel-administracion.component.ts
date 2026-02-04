import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-panel-administracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-administracion.component.html',
  styleUrls: ['./panel-administracion.component.css']
})
export class PanelAdministracionComponent implements OnInit {

  categoriaSeleccionada: string = "usuarios";
  busqueda: string = "";

  datos: any[] = [];
  datosOriginales: any[] = [];

  columnasVisibles: string[] = [];

  columnasOcultasPorCategoria: Record<string, string[]> = {
    usuarios: ["resetToken", "resetTokenExpiry", "tokenExpiration"],
    reservas: ["referenciaTransaccion", "fechaConfirmacion", "comentarios"],
    profesores: ["usuario", "setClases", "setHorarios"],
    clases: []
  };
  paginaActual = 0;
  totalPaginas = 1;

  // Modal
  modalVisible = false;
  itemSeleccionado: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    if (this.categoriaSeleccionada === 'profesores') {
      // Llamada específica para profesores
      this.adminService.getProfesores(this.paginaActual, 10).subscribe(resp => {
        this.datos = resp.content || [];
        this.totalPaginas = resp.totalPages;
        this.paginaActual = resp.number;

        this.columnasVisibles = this.datos.length > 0
          ? Object.keys(this.datos[0]).filter(col =>
            !this.columnasOcultasPorCategoria[this.categoriaSeleccionada].includes(col)
          )
          : [];

        this.datosOriginales = [...this.datos];
      });
      return; // evitamos seguir ejecutando el resto
    }

    // Para usuarios o reservas
    this.adminService.getDatos(this.categoriaSeleccionada, this.paginaActual, 10)
      .subscribe(resp => {
        this.datos = (resp.content || []).map((item: any) => {
          // Reemplazar nulos o indefinidos
          for (const key in item) {
            if (item[key] === null || item[key] === undefined || item[key] === '') {
              item[key] = 'No hay datos para mostrar';
            }
          }
          return item;
        });

        if (this.categoriaSeleccionada === 'reservas') {
          // Llamada específica para la tabla de reservas
          this.adminService.getDatosTablaReservas(this.paginaActual, 10).subscribe(tablaResp => {
            this.datos = tablaResp.content || [];

            // Si quieres poner un profesor fijo para todas las filas
            this.datos.forEach(item => {
              item.profesorClase = item.profesorClase || 'Kenneth Jensen';

              // Formatear fecha
              if (item.fechaReserva && item.fechaReserva !== 'No hay datos para mostrar') {
                const fecha = new Date(item.fechaReserva);
                item.fechaReserva = `${fecha.toLocaleDateString('es-ES')} ${fecha.toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'})}`;
              }
            });

            this.datosOriginales = [...this.datos];
            this.totalPaginas = tablaResp.totalPages;
            this.paginaActual = tablaResp.number;

            // Columnas fijas para reservas
            this.columnasVisibles = ['nombreAlumno', 'nombreClase', 'fechaReserva', 'estado', 'metodoPago'];
          });
          return; // evitamos seguir ejecutando el resto
        }

        this.datosOriginales = [...this.datos];
        this.totalPaginas = resp.totalPages;
        this.paginaActual = resp.number;

        // Columnas dinámicas
        this.columnasVisibles = this.datos && this.datos.length > 0
          ? Object.keys(this.datos[0]).filter(col =>
            !this.columnasOcultasPorCategoria[this.categoriaSeleccionada].includes(col)
          )
          : [];
      });
  }








  buscar() {
    if (!this.busqueda.trim()) {
      this.datos = [...this.datosOriginales];
      return;
    }

    this.datos = this.datosOriginales.filter(item =>
      Object.values(item).some(v =>
        String(v).toLowerCase().includes(this.busqueda.toLowerCase())
      )
    );
  }

  paginaAnterior() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.cargarDatos();
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.paginaActual++;
      this.cargarDatos();
    }
  }

  abrirModal(item: any) {
    this.itemSeleccionado = item;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }
  cambiarCategoria(nuevaCategoria: string) {
    this.categoriaSeleccionada = nuevaCategoria;
    this.busqueda = '';
    this.datos = [];
    this.datosOriginales = [];
    this.columnasVisibles = [];
    this.paginaActual = 0;
    this.totalPaginas = 1;

    this.cargarDatos();
  }


}



