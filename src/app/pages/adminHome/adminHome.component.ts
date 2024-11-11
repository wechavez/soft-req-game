import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  template: `<p>adminHome works!</p>`,
  styleUrl: './adminHome.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHomeComponent {}
