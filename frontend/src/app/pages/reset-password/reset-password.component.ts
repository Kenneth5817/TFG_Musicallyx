import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  tokenValido: boolean = false;
  cargando: boolean = false;
  mensaje: string = '';
  error: string = '';

  private apiUrl = 'https://tfg-musicallyx.onrender.com/v1/api/auth';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Obtener token de la URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.validarToken();
      } else {
        this.error = 'No se proporcionó un token válido';
        this.mensaje = 'El enlace no es válido. Solicita un nuevo restablecimiento.';
      }
    });
  }

  // Validador personalizado para que las contraseñas coincidan
  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Validar el token con el backend
  validarToken() {
    this.cargando = true;
    this.http.get(`${this.apiUrl}/validate-reset-token?token=${this.token}`)
      .subscribe({
        next: () => {
          this.tokenValido = true;
          this.mensaje = 'Token válido. Puedes cambiar tu contraseña.';
          this.cargando = false;
        },
        error: (error) => {
          this.tokenValido = false;
          this.error = 'Token inválido o expirado';
          this.mensaje = 'El enlace ha expirado o es inválido. Solicita un nuevo restablecimiento.';
          this.cargando = false;
        }
      });
  }

  // Cambiar la contraseña
  cambiarPassword() {
    if (this.resetForm.invalid) {
      this.error = 'Por favor, completa el formulario correctamente';
      return;
    }

    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    const nuevaPassword = this.resetForm.get('password')?.value;

    this.http.post(`${this.apiUrl}/reset-password`, {
      token: this.token,
      password: nuevaPassword
    }).subscribe({
      next: () => {
        this.mensaje = '✅ ¡Contraseña cambiada exitosamente!';
        this.cargando = false;
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/iniciar-sesion']);
        }, 3000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Error al cambiar la contraseña';
        this.mensaje = '';
        this.cargando = false;
      }
    });
  }
}
