import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReservaClasesComponent } from './pages/reserva-clases/reserva-clases.component';
import { MisReservasComponent } from './pages/mis-reservas/mis-reservas.component';
import { IniciarSesionComponent } from './pages/iniciar-sesion/iniciar-sesion.component'; // ✅ importa tu componente login
import { AuthGuard } from './services/authGuard.service';

const routes: Routes = [
  { path: '', redirectTo: '/reserva-clases', pathMatch: 'full' },
  { path: 'reserva-clases', component: ReservaClasesComponent },
  { path: 'mis-reservas', component: MisReservasComponent, canActivate: [AuthGuard] }, // ✅ aquí
  { path: 'iniciar-sesion', component: IniciarSesionComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
