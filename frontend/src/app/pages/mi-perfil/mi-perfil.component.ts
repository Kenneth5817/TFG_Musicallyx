import { Component } from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormsModule} from '@angular/forms';
import { Usuario } from '../../usuario.model';
import { UsuarioEstadoService } from '../../services/usuarioEstadoService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
  imports: [FormsModule, CommonModule]
})
export class MiPerfilComponent {
  constructor(private usuarioService: UserService, private usuarioEstado: UsuarioEstadoService) {
  }

  mostrarModal = false;
  modalTipo: 'exito' | 'error' = 'exito';
  modalMensaje = '';

  usuario: Usuario = {
    idUsuario: 0,
    nombre: '',
    email: '',
  };


  ngOnInit() {
    const data = localStorage.getItem('usuario');

    if (data) {
      const parsed = JSON.parse(data);

      // 👉 AQUÍ LLAMAS AL BACKEND
      this.usuarioService.getUsuarioByEmail(parsed.email).subscribe({
        next: (usuarioCompleto) => {
          this.usuario = usuarioCompleto;

          // Guardamos actualizado
          localStorage.setItem('usuario', JSON.stringify(usuarioCompleto));

          console.log("USUARIO COMPLETO:", this.usuario);
        },
        error: () => {
          console.error("Error cargando usuario");
        }
      });
    }
  }

  // mi-perfil.component.ts

  onNombreChange(nombre: string) {
    this.usuario.nombre = nombre;
    // Actualiza el servicio para notificar a AdminComponent
    this.usuarioEstado.setUsuario(this.usuario);
  }

  guardarCambios() {
    const datosActualizar = {
      nombre: this.usuario.nombre,
      email: this.usuario.email,
      telefono: this.usuario.telefono,
      nivelMusical: this.usuario.nivelMusical,
      gustosMusicales: this.usuario.gustosMusicales
    };

    this.usuarioService.updateUsuario(this.usuario.idUsuario, datosActualizar).subscribe({
      next: (actualizado) => {

        this.usuario = actualizado;
        this.usuarioEstado.setUsuario(actualizado);
        localStorage.setItem('usuario', JSON.stringify(actualizado));

        // ✅ MODAL ÉXITO
        this.modalTipo = 'exito';
        this.modalMensaje = 'Datos guardados correctamente';
        this.mostrarModal = true;


        setTimeout(() => this.mostrarModal = false, 2000);
      },
      error: () => {
        // ❌ MODAL ERROR
        this.modalTipo = 'error';
        this.modalMensaje = 'Error al guardar los datos';
        this.mostrarModal = true;

        setTimeout(() => this.mostrarModal = false, 2000);
      }
    });
  }
}
