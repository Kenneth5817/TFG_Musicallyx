import {ChangeDetectorRef, Component} from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../services/auth.service';
import * as bootstrap from 'bootstrap';
import { BuscarService, ResultadoBusqueda } from '../../services/buscarService';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [RouterModule, CommonModule, FormsModule]

})
export class HeaderComponent {
  isMenuOpen = false;


  termino: string = '';
  resultados: ResultadoBusqueda[] = [];
  seleccionado: ResultadoBusqueda | null = null;


  constructor(public router: Router,  private cdr: ChangeDetectorRef, private buscarService: BuscarService) {
  }
  public isActive(path: string): boolean {
    return this.router.url === path;
  }


  tieneSesion() {
    return !!localStorage.getItem('usuario');
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }



// Cada vez que escribes
  buscarEnTiempoReal(event: string) {
    this.resultados = this.buscarService.buscar(event);
  }


// Al hacer clic en un resultado
  seleccionarResultado(res: ResultadoBusqueda) {
    this.termino = res.titulo; // poner el texto en el input
    this.seleccionado = res;   // guardar la selección
    this.resultados = [];      // ocultar la lista
  }

// Al pulsar Buscar
  buscar() {
    if (!this.seleccionado) return; // si no hay selección no hacemos nada
    this.router.navigate([this.seleccionado.ruta]);
    this.termino = '';
    this.seleccionado = null;
  }

// Navegar al resultado seleccionado
  irA(resultado: ResultadoBusqueda) {
    this.router.navigate([resultado.ruta]);
    this.resultados = [];
    this.termino = '';
  }


  abrirMenuHamburguesa(offcanvas: HTMLElement) {
    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvas);
    bsOffcanvas.show();

    // Forzar Angular a actualizar bindings
    this.cdr.detectChanges();
  }
  closeOffcanvasAndNavigate(offcanvasElement: HTMLElement, path: string) {
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);

    const onHidden = () => {
      this.router.navigate([path]);
      offcanvasElement.removeEventListener('hidden.bs.offcanvas', onHidden);
    };

    offcanvasElement.addEventListener('hidden.bs.offcanvas', onHidden);
    bsOffcanvas.hide();
  }

}


