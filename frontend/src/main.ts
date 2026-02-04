import 'zone.js'; // <- Importa Zone.js antes de bootstrapApplication
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/app.routes';
import {provideHttpClient, withFetch} from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    })),
    provideHttpClient(withFetch()),
  ],
});
