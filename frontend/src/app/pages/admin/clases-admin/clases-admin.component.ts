import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-clases-admin',
  templateUrl: './clases-admin.component.html',
  styleUrls: ['./clases-admin.component.css'],
  imports: [CommonModule, RouterModule]
})
export class ClasesAdminComponent {}
