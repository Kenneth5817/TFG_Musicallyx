import { Component } from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
  imports: [FormsModule]
})
export class MiPerfilComponent {
  usuario: any = {};
  constructor(private usuarioService: UserService) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario')!);
  }

  guardarCambios() {
    this.usuarioService.updateUsuario(this.usuario).subscribe({
      next: (actualizado) => {
        alert("Datos actualizados correctamente");

        // 🔥 Actualiza localStorage con los nuevos datos
        localStorage.setItem('usuario', JSON.stringify(actualizado));
      },
      error: () => alert("Error al actualizar los datos")
    });
  }
}
