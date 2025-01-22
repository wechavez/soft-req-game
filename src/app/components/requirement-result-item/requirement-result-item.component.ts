import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ParseHtmlPipe } from '@pipes';
import type { Result as ResultType } from '@types';

@Component({
  selector: 'app-requirement-result-item',
  standalone: true,
  imports: [ParseHtmlPipe, CommonModule],
  templateUrl: './requirement-result-item.component.html',
  styles: ``,
})
export class RequirementResultItemComponent {
  index = input<number>(0);
  result = input<ResultType>('not-classified');
  text = input<string>('');
  feedback = input<string>('');
  isValid = input<boolean>(false);

  borderColor = computed(() => {
    switch (this.result()) {
      case 'correct':
        return 'var(--green-500)';
      case 'incorrect':
        return 'var(--red-500)';
      default:
        return 'var(--gray-500)';
    }
  });

  icon = computed(() => {
    switch (this.result()) {
      case 'correct':
        return 'pi pi-check';
      case 'incorrect':
        return 'pi pi-times';
      default:
        return 'pi pi-info-circle';
    }
  });

  userResponse = computed(() => {
    if (this.result() === 'not-classified') {
      return 'No clasificado';
    }

    return this.result() === 'correct' && this.isValid()
      ? 'No Ambiguo'
      : 'Ambiguo';
  });
}
