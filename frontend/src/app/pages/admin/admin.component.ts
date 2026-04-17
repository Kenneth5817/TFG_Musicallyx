import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UsuarioEstadoService} from '../../services/usuarioEstadoService';
import {Usuario} from '../../usuario.model';
import {tap} from 'rxjs';
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
    private usuarioEstado: UsuarioEstadoService,
    public router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {

    // 🔥 USUARIO INICIAL (RESTAURADO DESDE LOCALSTORAGE)
    const user = this.authService.getUser?.();

    if (user) {
      this.userName = user.nombre;
      this.isSpecialAdmin = user.rol === 'ADMIN';
    }

    // 🔥 REDIRECCIÓN AUTOMÁTICA INICIAL
    setTimeout(() => {
      if (this.isSpecialAdmin) {
        this.router.navigate(['/admin/gestion-admin']);
      } else {
        this.router.navigate(['/admin/clases-usuario']);
      }
    });

    // Escucha cambios en tiempo real
    this.usuarioEstado.usuario$.subscribe(usuario => {
      if (usuario) {
        this.userName = usuario.nombre;
        this.cd.detectChanges();
      }
    });

    // Suscripción para cambios de login
    this.authService.isLoggedIn$.subscribe(loggedIn => {

      const user = this.authService.getUser?.();

      if (loggedIn && user) {
        this.userName = user.nombre;
        this.isSpecialAdmin = user.rol === 'ADMIN';
      } else {
        this.userName = 'Usuario';
        this.isSpecialAdmin = false;
      }
    });

  }

  ngAfterViewInit() {
    this.offcanvasEl = document.getElementById('offcanvasAdminMenu');

    if (this.offcanvasEl) {
      this.offcanvasInstance =
        bootstrap.Offcanvas.getOrCreateInstance(this.offcanvasEl);
    }

    this.mostrarPanel = false;
    this.cd.detectChanges();
  }


  navigate(route: string) {
    const el = document.getElementById('offcanvasAdminMenu');
    const instance = bootstrap.Offcanvas.getInstance(el);

    const go = () => {
      this.router.navigate([route]);
      this.cleanupOffcanvas();
    };

    if (!instance) {
      go();
      return;
    }

    el?.addEventListener('hidden.bs.offcanvas', go, { once: true });
    instance.hide();
  }
  cleanupOffcanvas() {
    document.querySelectorAll('.offcanvas-backdrop').forEach(el => el.remove());
    document.body.classList.remove('offcanvas-open');
    document.body.style.overflow = '';
  }
  openOffcanvas() {

    const user = this.authService.getUser?.();

    if (user) {
      this.userName = user.nombre;
      this.isSpecialAdmin = user.rol === 'ADMIN';
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
      console.log('Archivo seleccionado:', this.selectedFile);
      this.profileImg = URL.createObjectURL(this.selectedFile);
    }

    localStorage.setItem('avatarBg', this.bgColor);

    this.showProfileCard = false;
  }
}
