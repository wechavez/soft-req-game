import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { GameStatus, Requirement } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-game-classification',
  standalone: true,
  imports: [PrimeNgModule, CommonModule],
  templateUrl: './game-classification.component.html',
  styles: `
    :host {
      width: 100%;
      max-width: 1024px;
    }
    .no-classified-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  `,
  host: {
    class: 'flex-1 flex flex-column gap-3',
  },
})
export class GameClassificationComponent implements OnInit {
  messageService = inject(MessageService);

  unclassifiedRequirements = model<Requirement[]>([]);
  selectedGoodRequirements = model<Requirement[]>([]);
  selectedBadRequirements = model<Requirement[]>([]);

  draggedRequirement = signal<Requirement | null>(null);

  gameStatus = model<GameStatus>('not-started');

  timeElapsed = signal<string>('00:00');
  movesCount = signal<number>(0);

  private startTime = signal<number>(0);
  private timerInterval: number | undefined;

  ngOnInit(): void {
    this.startTimer();
  }

  private startTimer() {
    this.startTime.set(Date.now());
    this.timerInterval = window.setInterval(() => {
      const elapsed = Date.now() - this.startTime();
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      this.timeElapsed.set(
        `${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`
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
    this.gameStatus.set('not-started');
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
    this.gameStatus.set('finished');
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
      requirements.filter((req) => req.no !== requirement.no)
    );
    this.selectedGoodRequirements.update((requirements) =>
      requirements.filter((req) => req.no !== requirement.no)
    );
    this.selectedBadRequirements.update((requirements) =>
      requirements.filter((req) => req.no !== requirement.no)
    );
  }
}
