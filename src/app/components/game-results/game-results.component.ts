import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequirementResultItemComponent } from '@components';
import { StudentService } from '@services';
import { GameStatus, Requirement, RequirementResult } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';

@Component({
  selector: 'app-game-results',
  standalone: true,
  imports: [PrimeNgModule, CommonModule, RequirementResultItemComponent],
  templateUrl: './game-results.component.html',
})
export class GameResultsComponent {
  private studentService = inject(StudentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  courseCode = computed(() => this.route.snapshot.params['courseId']);

  unclassifiedRequirements = input<Requirement[]>([]);
  selectedGoodRequirements = input<Requirement[]>([]);
  selectedBadRequirements = input<Requirement[]>([]);

  gameStatus = model<GameStatus>('not-started');

  currentAttempt = computed(() => this.studentService.currentGameAttempt());
  remainingAttempts = computed(() => this.currentAttempt()?.remaining);
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

    return results.sort((a, b) => a.requirement.id - b.requirement.id);
  });

  score = computed(() => {
    const correct = this.results().filter((r) => r.wasCorrect).length;
    const total = this.results().length;
    return `${correct}/${total}`;
  });
}
