import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import localeEs from '@angular/common/locales/es';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { InfoComponent } from './pages/info/info.component';
import { ClasesComponent } from './pages/clases/clases.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'info', component: InfoComponent},
      {path: 'clases', component: ClasesComponent},
      {
        path: 'mi-perfil',
        component: MiPerfilComponent
      }

    ]),
    InfoComponent,
    ClasesComponent,
    HomeComponent,
    AppComponent,
    FormsModule,
  ],
  providers: [      // ← agrega esto
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ]
})
export class AppModule { }
