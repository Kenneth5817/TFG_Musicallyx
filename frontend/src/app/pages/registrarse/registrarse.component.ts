import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {AuthService, Usuario} from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-registrarse',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})
export class RegistrarseComponent {
  registerForm: FormGroup;
  showFullScreenError = false;
  passwordCriteria = {
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    minLength: false
  };

  passwordsMatch = true;

  fieldCriteria = {
    nombre: {required: false},
    apellido: {required: false},
    email: {required: false, valid: false}
  };

  nombreCriteria = {
    valid: false,
    letters: false,
    minLength: false
  };

  apellidoCriteria = {
    valid: false,
    letters: false,
    minLength: false
  };

  emailCriteria = {required: false, valid: false};

  passwordVisible: boolean = false;
  repetirPasswordVisible: boolean = false;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;

    const input = document.querySelector('input[formControlName="password"]') as HTMLInputElement;
    if (input) input.type = this.passwordVisible ? 'text' : 'password';
  }

  toggleRepetirPasswordVisibility() {
    this.repetirPasswordVisible = !this.repetirPasswordVisible;

    const input = document.querySelector('input[formControlName="repetirPassword"]') as HTMLInputElement;
    if (input) input.type = this.repetirPasswordVisible ? 'text' : 'password';
  }


  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,]).{8,}$/)]],
      repetirPassword: ['', Validators.required]
    });
  }


  get nombre() {
    return this.registerForm.get('nombre');
  }

  get apellido() {
    return this.registerForm.get('apellido');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get repetirPassword() {
    return this.registerForm.get('repetirPassword');
  }

  updateFieldCriteria(field: 'nombre' | 'apellido' | 'email') {
    const value = this.registerForm.get(field)?.value || '';

    if (field === 'email') {
      this.fieldCriteria.email.required = value.length > 0;
      this.fieldCriteria.email.valid = this.email?.valid || false;
      this.emailCriteria = {...this.fieldCriteria.email};
    } else {
      const letters = /^[a-zA-ZÀ-ÿ\s]+$/.test(value);
      const minLength = value.replace(/\s/g, '').length >= 3;

      if (field === 'nombre') {
        this.nombreCriteria.letters = letters;
        this.nombreCriteria.minLength = minLength;
        this.nombreCriteria.valid = letters && minLength;
      }

      if (field === 'apellido') {
        this.apellidoCriteria.letters = letters;
        this.apellidoCriteria.minLength = minLength;
        this.apellidoCriteria.valid = letters && minLength;
      }
    }
  }

  updatePasswordCriteria(): void {
    const value = this.password?.value || '';
    this.passwordCriteria = {
      hasUpper: /[A-Z]/.test(value),
      hasLower: /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecial: /[!@#$%^&*.,]/.test(value),
      minLength: value.length >= 8
    };
    this.checkPasswords();
  }

  checkPasswords(): void {
    this.passwordsMatch = this.password?.value === this.repetirPassword?.value;
  }

  getChecklistClass(criteria: any): string {
    // siempre vacío, checklist nunca se oculta
    return '';
  }


  onSubmit(): void {
    this.checkPasswords();
    if (this.registerForm.valid && this.passwordsMatch) {

      // ✅ Datos que envía al backend
      const nuevoUsuarioBackend = {
        nombre: this.registerForm.value.nombre,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(nuevoUsuarioBackend).subscribe({
        next: (usuarioRegistrado) => {
          console.log('Usuario registrado:', usuarioRegistrado);

          // ✅ Objeto para guardar en el frontend
          const usuarioParaSesion: Usuario = {
            idUsuario: 0,
            nombre: usuarioRegistrado.nombre,
            email: usuarioRegistrado.email,
            rol: usuarioRegistrado.rol,
          };

          this.authService.setUser(usuarioParaSesion);

          const successNotification = document.getElementById('successNotification');
          successNotification?.classList.add('show');
          this.registerForm.disable();
          setTimeout(() => window.location.href = "/iniciar-sesion", 3000);
        },
        error: (err) => {
          console.error('Error completo:', err);
          const msg =
            err.error?.message ||
            JSON.stringify(err.error) ||
            err.message ||
            'Error desconocido';
          alert('Error al registrar usuario: ' + msg);
        }
      });

    } else {
      this.registerForm.markAllAsTouched();
      this.showFullScreenError = true;
    }
  }


  closeFullScreenError() {
    this.showFullScreenError = false;
  }
}
