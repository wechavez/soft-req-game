import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ParseHtmlPipe } from '@pipes';
import { StudentService } from '@services';
import { GameStatus, Requirement, RequirementResult } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-game-classification',
  standalone: true,
  imports: [PrimeNgModule, CommonModule, ParseHtmlPipe],
  templateUrl: './game-classification.component.html',
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .classification-container {
      height: calc(100% - 61px);
    }
  `,
})
export class GameClassificationComponent implements OnInit {
  messageService = inject(MessageService);
  studentService = inject(StudentService);

  unclassifiedRequirements = model<Requirement[]>([]);
  selectedGoodRequirements = model<Requirement[]>([]);
  selectedBadRequirements = model<Requirement[]>([]);

  draggedRequirement = signal<Requirement | null>(null);

  gameStatus = model<GameStatus>('not-started');

  savingAttempt = signal<boolean>(false);

  timeElapsed = signal<string>('00:00:00');
  movesCount = signal<number>(0);

  private startTime = signal<number>(0);
  private timerInterval: number | undefined;

  currentAttemptId = computed(
    () => this.studentService.currentGameAttempt()?.id
  );

  ngOnInit(): void {
    this.startTimer();
  }

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
    return +(correct / total).toFixed(2);
  });

  private startTimer() {
    this.startTime.set(Date.now());
    this.timerInterval = window.setInterval(() => {
      const elapsed = Date.now() - this.startTime();
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      this.timeElapsed.set(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  abandonGame() {
    this.stopTimer();

    this.studentService
      .updateAttemptStatusAndStats({
        status: 'abandoned',
        attemptId: +this.currentAttemptId()!,
        movements: this.movesCount(),
        score: this.score(),
        time: this.timeElapsed(),
        requirements: this.results().map((r) => ({
          id: r.requirement.id,
          result: 'not-classified',
        })),
      })
      .subscribe({
        next: () => {
          this.gameStatus.set('not-started');
        },
        error: (error) => {
          this.gameStatus.set('not-started');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  checkResults() {
    if (this.unclassifiedRequirements().length !== 0) {
      return this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se han clasificado todos los requisitos',
      });
    }

    this.stopTimer();
    this.submitResults();
  }

  submitResults() {
    this.savingAttempt.set(true);
    this.studentService
      .updateAttemptStatusAndStats({
        status: 'completed',
        attemptId: +this.currentAttemptId()!,
        movements: this.movesCount(),
        score: this.score(),
        time: this.timeElapsed(),
        requirements: this.results().map((r) => ({
          id: r.requirement.id,
          result: r.wasCorrect ? 'correct' : 'incorrect',
        })),
      })
      .subscribe({
        next: () => {
          this.savingAttempt.set(false);
          this.gameStatus.set('finished');
        },
        error: (error) => {
          this.savingAttempt.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  dragStart(requirement: Requirement) {
    this.draggedRequirement.set(requirement);
  }

  dropGood() {
    if (this.draggedRequirement) {
      this.movesCount.update((count) => count + 1);
      this.removeFromSourceList(this.draggedRequirement()!);
      this.selectedGoodRequirements.update((requirements) => [
        ...requirements,
        this.draggedRequirement()!,
      ]);
      this.draggedRequirement.set(null);
    }
  }

  dropBad() {
    if (this.draggedRequirement()) {
      this.movesCount.update((count) => count + 1);
      this.removeFromSourceList(this.draggedRequirement()!);
      this.selectedBadRequirements.update((requirements) => [
        ...requirements,
        this.draggedRequirement()!,
      ]);
      this.draggedRequirement.set(null);
    }
  }

  dropUnclassified() {
    if (this.draggedRequirement) {
      this.movesCount.update((count) => count + 1);

      this.removeFromSourceList(this.draggedRequirement()!);
      this.unclassifiedRequirements.update((requirements) => [
        ...requirements,
        this.draggedRequirement()!,
      ]);

      this.draggedRequirement.set(null);
    }
  }

  dragEnd() {
    this.draggedRequirement.set(null);
  }

  private removeFromSourceList(requirement: Requirement) {
    this.unclassifiedRequirements.update((requirements) =>
      requirements.filter((req) => req.id !== requirement.id)
    );
    this.selectedGoodRequirements.update((requirements) =>
      requirements.filter((req) => req.id !== requirement.id)
    );
    this.selectedBadRequirements.update((requirements) =>
      requirements.filter((req) => req.id !== requirement.id)
    );
  }
}
