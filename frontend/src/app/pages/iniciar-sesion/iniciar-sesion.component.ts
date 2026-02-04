import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';


interface Alumno {
  idAlumno: number;
  // otros campos que pueda tener Alumno
}

interface Usuario {
  idUsuario: number;
  nombre: string;
  email: string;
  alumno?: Alumno;
  rol?: "ADMIN" | "USER";}

@Component({
  standalone: true,
  selector: 'app-iniciar-sesion',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent implements OnInit {
  loginForm: FormGroup;
  passwordVisible: boolean = false;

  emailCriteria = {valid: false, required: false};
  passwordCriteria = {hasUpper: false, hasLower: false, hasNumber: false, hasSpecial: false, minLength: false};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,]).{8,}$/)
      ]],
      remember: [false]
    });
  }

  get email(): AbstractControl {
    return this.loginForm.get('email')!;
  }

  get password(): AbstractControl {
    return this.loginForm.get('password')!;
  }

  ngOnInit() {

    this.loginForm.get('email')!.valueChanges.subscribe(value => this.updateEmailCriteria(value || ''));
    this.loginForm.get('password')!.valueChanges.subscribe(value => this.updatePasswordCriteria(value || ''));

    error: (err: any) => {
      if (err.status === 401) {
        this.showErrorNotification(err.error?.message || 'Usuario o contraseña incorrectos');
      } else {
        this.showErrorNotification('Error desconocido');
      }
      this.loginForm.enable();
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  updateEmailCriteria(value: string) {
    this.emailCriteria.required = value.length > 0;
    this.emailCriteria.valid = this.email?.valid || false;
  }

  updatePasswordCriteria(value: string) {
    this.passwordCriteria.hasUpper = /[A-Z]/.test(value);
    this.passwordCriteria.hasLower = /[a-z]/.test(value);
    this.passwordCriteria.hasNumber = /\d/.test(value);
    this.passwordCriteria.hasSpecial = /[!@#$%^&*.,]/.test(value);
    this.passwordCriteria.minLength = value.length >= 8;
  }

  showFullScreenNotification = false;
  notificationType: 'success' | 'error' = 'success';
  notificationTitle = '';
  notificationMessage = '';

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.loginBackend(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (usuario) => {
            this.authService.setUser(usuario);

            this.notificationType = 'success';
            this.notificationTitle = '¡Bienvenido!';
            this.notificationMessage = 'Has iniciado sesión correctamente';
            this.showFullScreenNotification = true;

            this.loginForm.disable();

            // 🔹 Esperar 1.5s antes de redirigir
            setTimeout(() => {
              this.router.navigate(['/admin']); // ambos roles al mismo panel
              this.closeNotification(); // opcional: cerrar notificación
            }, 1500);


          },
          error: (err) => {
            let mensaje = err.error?.message || err.message || 'Usuario o contraseña incorrectos';
            this.showErrorNotification(mensaje);
            this.loginForm.enable();
          }
        });
    } else {
      this.showErrorNotification('Por favor completa todos los campos');
    }
  }


  showErrorNotification(message: string) {
    this.notificationType = 'error';
    this.notificationTitle = '¡Formulario incompleto!';
    this.notificationMessage = message;
    this.showFullScreenNotification = true;
  }

  closeNotification() {
    this.showFullScreenNotification = false;

}


  forgotPassword(event: Event) {
    event.preventDefault(); // Previene que el navegador haga GET
    const emailValue = this.email?.value;
    if (!emailValue) {
      this.showErrorNotification('Por favor ingresa tu correo para recuperar la contraseña');
      return;
    }

    this.authService.sendResetPasswordEmail(emailValue).subscribe({
      next: () => {
        this.notificationType = 'success';
        this.notificationTitle = 'Correo enviado';
        this.notificationMessage = 'Revisa tu bandeja de entrada para restablecer tu contraseña';
        this.showFullScreenNotification = true;
      },
      error: (err) => {
        let msg = err.error?.message || 'No se pudo enviar el correo';
        this.showErrorNotification(msg);
      }
    });
  }
}

