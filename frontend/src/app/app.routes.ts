import { Routes } from '@angular/router';
import { MisReservasComponent } from './pages/mis-reservas/mis-reservas.component';
import { ReservaClasesComponent } from './pages/reserva-clases/reserva-clases.component';
import {AuthGuard} from './services/authGuard.service';
import {ClasesUsuarioComponent} from './pages/clases-usuario/clases-usuario.component';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },

  { path: 'info', loadComponent: () => import('./pages/info/info.component').then(m => m.InfoComponent) },
  { path: 'clases', loadComponent: () => import('./pages/clases/clases.component').then(m => m.ClasesComponent) },
  { path: 'iniciar-sesion', loadComponent: () => import('./pages/iniciar-sesion/iniciar-sesion.component').then(m => m.IniciarSesionComponent) },
  { path: 'juego-simon', loadComponent: () => import('./pages/juego-simon/juego-simon.component').then(m => m.JuegoSimonComponent) },
  { path: 'juegos-musicales', loadComponent: () => import('./pages/juegos-musicales/juegos-musicales.component').then(m => m.JuegosMusicalesComponent) },
  { path: 'oido-absoluto', loadComponent: () => import('./pages/oido-absoluto/oido-absoluto.component').then(m => m.OidoAbsolutoComponent) },
  { path: 'registrarse', loadComponent: () => import('./pages/registrarse/registrarse.component').then(m => m.RegistrarseComponent) },
  { path: 'reserva-clases', loadComponent: () => import('./pages/reserva-clases/reserva-clases.component').then(m => m.ReservaClasesComponent) },
  { path: 'adivinar-compas', loadComponent: () => import('./pages/adivinar-compas/adivinar-compas.component').then(m => m.AdivinarCompasComponent) },
  { path: 'adivinar-instrumento', loadComponent: () => import('./pages/adivinar-instrumento/adivinar-instrumento.component').then(m => m.AdivinarInstrumentoComponent) },
  { path: 'adivinar-estilo', loadComponent: () => import('./pages/adivinar-estilo/adivinar-estilo.component').then(m => m.AdivinarEstiloComponent) },
  { path: 'memorizar-instrumento', loadComponent: () => import('./pages/memorizar-instrumento/memorizar-instrumento.component').then(m => m.MemorizarInstrumentoComponent) },
  { path: 'mis-reservas', loadComponent: () => import('./pages/mis-reservas/mis-reservas.component').then(m => m.MisReservasComponent) },
  { path: 'clases-usuario', loadComponent: () => import('./pages/clases-usuario/clases-usuario.component').then(m => m.ClasesUsuarioComponent) },


  // Admin con layout independiente
  // Rutas del panel admin
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/admin/usuarios/usuarios.component').then(m => m.UsuariosComponent)
      },
      {
        path: 'juegos-musicales',
        loadComponent: () => import('./pages/juegos-musicales/juegos-musicales.component').then(m => m.JuegosMusicalesComponent)
      },

      {
        path: 'reservar-clase',
        loadComponent: () => import('./pages/reserva-clases/reserva-clases.component').then(m => m.ReservaClasesComponent)
      },

      {
        path: 'clases',
        loadComponent: () => import('./pages/admin/clases-admin/clases-admin.component').then(m => m.ClasesAdminComponent)
      },
      {
        path: 'correo',
        loadComponent: () => import('./pages/correo/correo.component').then(m => m.CorreoComponent)
      },
      {
        path: 'info',
        loadComponent: () => import('./pages/info/info.component').then(m => m.InfoComponent)
      },
       {
        path: 'mis-reservas',
        loadComponent: () => import('./pages/mis-reservas/mis-reservas.component').then(m => m.MisReservasComponent)
      },

       { path: 'gestion-admin',
        loadComponent: () => import('./pages/gestion-admin/gestion-admin.component').then(m => m.GestionAdminComponent)
},
      {
        path: 'mi-perfil',
        loadComponent: () => import('./pages/mi-perfil/mi-perfil.component').then(m => m.MiPerfilComponent),
        canActivate: [AuthGuard] // Solo usuarios logueados
      },


      { path: 'clases-usuario', loadComponent: () => import('./pages/clases-usuario/clases-usuario.component').then(m => m.ClasesUsuarioComponent) },

      { path: 'reserva-clases', loadComponent: () => import('./pages/reserva-clases/reserva-clases.component').then(m => m.ReservaClasesComponent) },

      { path: 'panel-administracion',
              loadComponent: () => import('./pages/panel-administracion/panel-administracion.component')
    .then(m => m.PanelAdministracionComponent)
  },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // ruta por defecto al entrar en /admin
    ]
  },

  { path: '**', redirectTo: '' },
];
