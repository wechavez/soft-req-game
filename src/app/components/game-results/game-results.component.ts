import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ParseHtmlPipe } from '@pipes';
import { StudentService } from '@services';
import { GameStatus, Requirement, RequirementResult } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';

@Component({
  selector: 'app-game-results',
  standalone: true,
  imports: [PrimeNgModule, CommonModule, ParseHtmlPipe],
  templateUrl: './game-results.component.html',
  styles: `
    :host {
      display: block;
      height: 100%;
      overflow-y: auto;
    }

    .results-container {
      height: calc(100% - 99px);
      overflow-y: auto;
    }
  `,
})
export class GameResultsComponent {
  private studentService = inject(StudentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  roomCode = computed(() => this.route.snapshot.params['room_code']);

  unclassifiedRequirements = input<Requirement[]>([]);
  selectedGoodRequirements = input<Requirement[]>([]);
  selectedBadRequirements = input<Requirement[]>([]);

  gameStatus = model<GameStatus>('not-started');

  remainingAttempts = computed(
    () => this.studentService.currentGameAttempt()?.remaining
  );
  isTheLastAttempt = computed(() => this.remainingAttempts() === 1);

  clickTryAgain = output<void>();
  clickBackToHome = output<void>();
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
}
