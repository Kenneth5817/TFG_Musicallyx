import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class KeepAliveService {

  private url = 'https://tfg-musicallyx.onrender.com/v1/api/ping';

  constructor(private http: HttpClient) {}

  start() {
    setInterval(() => {
      this.http.get(this.url).subscribe({
        next: () => console.log('💓 backend activo'),
        error: () => console.log('⚠️ ping falló')
      });
    }, 2 * 60 * 1000); // cada 2 min
  }
}
