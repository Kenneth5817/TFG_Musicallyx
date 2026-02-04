import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ordenar', standalone: true })
export class OrdenarPipe implements PipeTransform {
  transform(value: any[], campo: string): any[] {
    if (!value) return [];
    return value.slice().sort((a, b) => {
      if (campo === 'fecha') {
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      } else {
        return a[campo].localeCompare(b[campo]);
      }
    });
  }
}
