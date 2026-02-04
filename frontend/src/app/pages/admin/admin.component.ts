import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})

export class AdminComponent implements OnInit, AfterViewInit {
  mostrarPanel = true;
  loggingOut = false;
  profileImg: string | null = null;
  hasSelectedRoute = false;
  isSpecialAdmin: boolean = false;
  userName: string = 'Usuario';
  sidebarOpen = false;
  offcanvasEl: any;
  offcanvasInstance: any;

  constructor(
    public authService: AuthService,
    public router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Inicializa el menú inmediatamente según el usuario
    if (this.authService.user) {
      this.userName = this.authService.user.nombre;
      this.profileImg = '';
      this.isSpecialAdmin = this.authService.user.rol === 'ADMIN';
    }

    // Suscripción para cambios de login
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      if (loggedIn && this.authService.user) {
        this.userName = this.authService.user.nombre;
        this.isSpecialAdmin = this.authService.user.rol === 'ADMIN';
      } else {
        this.userName = 'Usuario';
        this.isSpecialAdmin = false;
      }
    });
  }

  ngAfterViewInit() {
    // Inicializa Offcanvas
    this.offcanvasEl = document.getElementById('offcanvasAdminMenu');
    this.offcanvasInstance = new bootstrap.Offcanvas(this.offcanvasEl);

    // Cambios que afectan la vista
    this.mostrarPanel = false;
    this.cd.detectChanges();
  }

  navigate(route: string) {
    const offcanvasEl = document.getElementById('offcanvasAdminMenu');
    if (!offcanvasEl) {
      this.router.navigate([route]); // fallback si no hay offcanvas
      return;
    }

    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) {
      offcanvasEl.addEventListener(
        'hidden.bs.offcanvas',
        () => this.router.navigate([route]),
        { once: true } // se ejecuta solo una vez
      );
      bsOffcanvas.hide();
    } else {
      this.router.navigate([route]);
    }
  }



  openOffcanvas() {
    if (this.authService.user) {
      this.userName = this.authService.user.nombre;
      this.isSpecialAdmin = this.authService.user.rol === 'ADMIN';
    }
    this.offcanvasInstance.show();
  }

  closeOffcanvas() {
    const offcanvasEl = document.getElementById('offcanvasAdminMenu');
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) bsOffcanvas.hide();
  }


  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onRouteSelected() {
    this.hasSelectedRoute = true;
  }

  cambiarFoto(nuevaImg: string) {
    this.profileImg = nuevaImg;
  }

  logout() {
    this.loggingOut = true;
    this.authService.logout();

    setTimeout(() => {
      this.loggingOut = false;
      this.router.navigate(['/']);
    }, 1500);
  }

  get userInitials(): string {
    if (this.profileImg) return '';
    if (!this.userName) return '';
    const parts = this.userName.trim().split(' ');
    return parts.slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('');
  }

  showProfileCard = false;
  bgColor = '#ff4d4f';
  selectedFile: File | null = null;

  toggleProfileCard() {
    this.showProfileCard = !this.showProfileCard;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  saveProfile() {
    if (this.selectedFile) {
      // Lógica para subir imagen al backend
      console.log('Archivo seleccionado:', this.selectedFile);
      this.profileImg = URL.createObjectURL(this.selectedFile);
    }

    // Guardar color en localStorage o backend
    localStorage.setItem('avatarBg', this.bgColor);

    this.showProfileCard = false; // cerrar card
  }
}
