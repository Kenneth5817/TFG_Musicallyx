import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ]
})
export class AppComponent {
  showHeaderFooter = true;
  loggingOut = false;

  constructor(private router: Router, private authService: AuthService) {
    // Mostrar/ocultar header/footer según la ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const hiddenRoutes = ['/admin', '/iniciar-sesion', '/registrarse']; // Rutas donde ocultamos header/footer
      this.showHeaderFooter = !hiddenRoutes.some(route => event.urlAfterRedirects.startsWith(route));
    });
  }

  logout() {
    this.loggingOut = true;
    this.authService.logout();

    setTimeout(() => {
      this.loggingOut = false;
      this.router.navigate(['/']);
    }, 1500);
  }
}

