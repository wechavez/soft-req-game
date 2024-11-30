import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [],
  templateUrl: './empty-state.component.html',
  styles: ``,
})
export class EmptyStateComponent {
  message = input<string>('No se encontraron resultados');
}
