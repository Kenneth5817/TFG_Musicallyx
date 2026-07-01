import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {

    const token = localStorage.getItem('token');

    if (token && token !== 'null' && token !== 'undefined') {
      return true;
    }

    this.router.navigate(['/iniciar-sesion']);
    return false;
  }
}
