import { CommonModule } from '@angular/common';
import { Component, computed, input, model, output } from '@angular/core';
import { GameStatus, Requirement, RequirementResult } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';

@Component({
  selector: 'app-game-results',
  standalone: true,
  imports: [PrimeNgModule, CommonModule],
  templateUrl: './game-results.component.html',
  styles: `
    :host {
      width: 100%;
      max-width: 1024px;
    }

    p {
      margin: 0;
    }
  `,
})
export class GameResultsComponent {
  unclassifiedRequirements = input<Requirement[]>([]);
  selectedGoodRequirements = input<Requirement[]>([]);
  selectedBadRequirements = input<Requirement[]>([]);

  gameStatus = model<GameStatus>('not-started');

  clickTryAgain = output<void>();

  results = computed(() => {
    const results: RequirementResult[] = [];

    this.selectedGoodRequirements().forEach((requirement) => {
      results.push({
        requirement,
        wasCorrect: requirement.isValid === true,
      });
    });

    this.selectedBadRequirements().forEach((requirement) => {
      results.push({
        requirement,
        wasCorrect: requirement.isValid === false,
      });
    });

    return results.sort((a, b) => a.requirement.no - b.requirement.no);
  });

  score = computed(() => {
    const correct = this.results().filter((r) => r.wasCorrect).length;
    const total = this.results().length;
    return `${correct}/${total}`;
  });

  returnToHome() {
    this.gameStatus.set('not-started');
  }
}
