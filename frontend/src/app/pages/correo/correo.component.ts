import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, Usuario } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Reserva } from '../../models/reserva.model';

interface Mensaje {
  id: number;
  emisor: string;
  receptor: string;
  asunto?: string;
  texto: string;
  fechaEnvio: string;
  leido: boolean;
  seleccionado?: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './correo.component.html',
  styleUrls: ['./correo.component.css']
})
export class CorreoComponent implements OnInit {

  usuarioActual = '';
  usuarios: Usuario[] = [];
  reservas: Reserva[] = [];

  mensajesRecibidos: Mensaje[] = [];
  mensajesEnviados: Mensaje[] = [];

  mensajesRecibidosFiltrados: Mensaje[] = [];
  mensajesEnviadosFiltrados: Mensaje[] = [];

  mostrandoEnviados = false;
  mensajeSeleccionado: Mensaje | null = null;

  receptor = '';
  asunto = '';
  texto = '';

  vistaActual: 'bandeja' | 'detalle' | 'nuevo' = 'bandeja';

  private baseUrl = 'http://localhost:8080/api/mensajes';

  // --- MODAL ---
  mostrarModal = false;
  modalMensaje = '';
  modalTipo: 'exito' | 'error' = 'exito';

  filtroTexto = '';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.user?.email || '';
    this.cargarUsuarios();
    this.cargarRecibidos(); // carga inicial de mensajes
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  enviarMensaje() {
    if (!this.receptor || !this.texto.trim()) {
      this.modalTipo = 'error';
      this.modalMensaje = '❌ Debes completar receptor y mensaje';
      this.mostrarModal = true;
      return;
    }

    const mensaje = {
      emisor: this.usuarioActual,
      receptor: this.receptor,
      asunto: this.asunto,
      texto: this.texto
    };

    this.http.post<Mensaje>(`${this.baseUrl}/enviar`, mensaje).subscribe({
      next: (msg) => {
        // Limpiar campos
        this.texto = '';
        this.asunto = '';
        this.receptor = '';
        this.vistaActual = 'bandeja';

        // Recargar bandejas
        this.cargarEnviados();
        this.cargarRecibidos();

        // Modal éxito
        this.modalTipo = 'exito';
        this.modalMensaje = '✅ Mensaje enviado correctamente';
        this.mostrarModal = true;
      },
      error: (_err: HttpErrorResponse) => {
        this.modalTipo = 'error';
        this.modalMensaje = '❌ Error al enviar mensaje';
        this.mostrarModal = true;
      }
    });
  }

  cargarUsuarios() {
    this.userService.getUsuarios().subscribe({
      next: (users: Usuario[]) => {
        if (this.usuarioActual === 'a@admin.com') {
          // Admin puede ver todos
          this.usuarios = users.filter(u => u.email !== this.usuarioActual);
        } else {
          // Usuario normal solo ve al admin
          this.usuarios = users.filter(u => u.email === 'a@admin.com');
          // Preseleccionamos al admin para no dejar vacío
          this.receptor = this.usuarios.length ? this.usuarios[0].email : '';
        }
      },
      error: () => {
        this.modalTipo = 'error';
        this.modalMensaje = '❌ Error al cargar usuarios';
        this.mostrarModal = true;
      }
    });
  }


  cargarRecibidos() {
    this.mostrandoEnviados = false;
    this.mensajeSeleccionado = null;
    this.vistaActual = 'bandeja';

    this.http.get<Mensaje[]>(`${this.baseUrl}/recibidos`, { params: { usuario: this.usuarioActual } })
      .subscribe({
        next: (msgs) => {
          this.mensajesRecibidos = msgs;
          this.mensajesRecibidosFiltrados = msgs.map(m => ({ ...m }));
        },
        error: () => {
          this.modalTipo = 'error';
          this.modalMensaje = '❌ Error al obtener mensajes recibidos';
          this.mostrarModal = true;
        }
      });
  }

  cargarEnviados() {
    this.mostrandoEnviados = true;
    this.mensajeSeleccionado = null;
    this.vistaActual = 'bandeja';

    this.http.get<Mensaje[]>(`${this.baseUrl}/enviados`, { params: { usuario: this.usuarioActual } })
      .subscribe({
        next: (msgs) => {
          this.mensajesEnviados = msgs;
          this.mensajesEnviadosFiltrados = msgs.map(m => ({ ...m }));
        },
        error: () => {
          this.modalTipo = 'error';
          this.modalMensaje = '❌ Error al obtener mensajes enviados';
          this.mostrarModal = true;
        }
      });
  }

  seleccionarMensaje(msg: Mensaje) {
    this.mensajeSeleccionado = msg;
    this.vistaActual = 'detalle';
  }

  nuevoMensaje() {
    this.mensajeSeleccionado = null;
    this.receptor = '';
    this.asunto = '';
    this.texto = '';
    this.vistaActual = 'nuevo';
  }

  volver() {
    this.vistaActual = 'bandeja';
  }

  filtrarMensajes() {
    const texto = this.filtroTexto.toLowerCase();
    this.mensajesRecibidosFiltrados = this.mensajesRecibidos.filter(m =>
      (m.asunto?.toLowerCase().includes(texto)) || (m.texto.toLowerCase().includes(texto))
    );
    this.mensajesEnviadosFiltrados = this.mensajesEnviados.filter(m =>
      (m.asunto?.toLowerCase().includes(texto)) || (m.texto.toLowerCase().includes(texto))
    );
  }

  marcarSeleccionadosLeidos() {
    const lista = this.mostrandoEnviados ? this.mensajesEnviadosFiltrados : this.mensajesRecibidosFiltrados;
    const seleccionados = lista.filter(msg => msg.seleccionado);
    if (!seleccionados.length) {
      this.modalTipo = 'error';
      this.modalMensaje = '❌ No hay mensajes seleccionados';
      this.mostrarModal = true;
      return;
    }

    const ids = seleccionados.map(msg => msg.id);

    this.http.put<Mensaje[]>(`${this.baseUrl}/marcar-leidos`, ids).subscribe({
      next: (msgsActualizados) => {
        msgsActualizados.forEach(m => {
          const original = lista.find(msg => msg.id === m.id);
          if (original) original.leido = m.leido;
        });
        this.modalTipo = 'exito';
        this.modalMensaje = `${msgsActualizados.length} mensaje(s) marcados como leídos`;
        this.mostrarModal = true;
      },
      error: () => {
        this.modalTipo = 'error';
        this.modalMensaje = 'Error al marcar mensajes como leídos';
        this.mostrarModal = true;
      }
    });
  }

  // Variables del modal de confirmación
  mostrarModalConfirmacion = false;
  mensajesAEliminar: Mensaje[] = [];

// Al hacer click en eliminar
  borrarSeleccionados() {
    const lista = this.mostrandoEnviados ? this.mensajesEnviadosFiltrados : this.mensajesRecibidosFiltrados;
    this.mensajesAEliminar = lista.filter(msg => msg.seleccionado);

    if (!this.mensajesAEliminar.length) return;

    // Abrimos modal en vez de confirm()
    this.mostrarModalConfirmacion = true;
  }

// Confirmar borrado
  confirmarBorrado() {
    const lista = this.mostrandoEnviados ? this.mensajesEnviadosFiltrados : this.mensajesRecibidosFiltrados;

    if (this.mostrandoEnviados) {
      this.mensajesEnviados = this.mensajesEnviados.filter(m => !this.mensajesAEliminar.includes(m));
      this.mensajesEnviadosFiltrados = [...this.mensajesEnviados];
    } else {
      this.mensajesRecibidos = this.mensajesRecibidos.filter(m => !this.mensajesAEliminar.includes(m));
      this.mensajesRecibidosFiltrados = [...this.mensajesRecibidos];
    }

    this.mostrarModalConfirmacion = false;
    this.mensajesAEliminar = [];

    this.modalTipo = 'exito';
    this.modalMensaje = `Mensajes eliminados correctamente`;
    this.mostrarModal = true;
  }

// Cancelar borrado
  cancelarBorrado() {
    this.mostrarModalConfirmacion = false;
    this.mensajesAEliminar = [];
  }



  marcarTodosLeidos() {
    const lista = this.mostrandoEnviados ? this.mensajesEnviadosFiltrados : this.mensajesRecibidosFiltrados;
    const ids = lista.map(m => m.id);

    this.http.put<Mensaje[]>(`${this.baseUrl}/marcar-leidos`, ids).subscribe({
      next: (msgsActualizados) => {
        msgsActualizados.forEach(m => {
          const original = lista.find(msg => msg.id === m.id);
          if (original) original.leido = m.leido;
        });
      },
      error: () => {
        this.modalTipo = 'error';
        this.modalMensaje = 'Error al marcar mensajes como leídos';
        this.mostrarModal = true;
      }
    });
  }

}




