import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { GameResultsComponent } from '@components';
import { ContentGenerationService, StudentService } from '@services';
import { GameStatus, Requirement } from '@types';
import { RequirementResult } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { GameClassificationComponent } from '../../components/game-classification/game-classification.component';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PrimeNgModule,
    CommonModule,
    GameResultsComponent,
    GameClassificationComponent,
  ],

  templateUrl: './home.component.html',
  styles: [
    `
      :host ::ng-deep {
        [pDraggable] {
          cursor: move;
        }
      }
    `,
  ],
  host: {
    class: 'flex flex-1 justify-content-center',
  },
})
export class HomeComponent implements OnInit {
  contentGenerationService = inject(ContentGenerationService);
  studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loadingAttemptInfo = signal(false);

  unclassifiedRequirements = model<Requirement[]>([]);
  selectedGoodRequirements = model<Requirement[]>([]);
  selectedBadRequirements = model<Requirement[]>([]);

  roomCode = signal<string | null>(null);

  gameStatus = model<GameStatus>('not-started');

  currentGameAttempt = this.studentService.currentGameAttempt;
  remainingAttempts = computed(() => this.currentGameAttempt()?.remaining);

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    this.roomCode.set(params['room_code']);

    if (!this.roomCode()) {
      this.router.navigate(['/courses']);
      return;
    }

    if (!this.remainingAttempts()) {
      this.checkRemainingAttempts();
    }
  }

  checkRemainingAttempts() {
    this.loadingAttemptInfo.set(true);
    this.studentService.checkAttemptsRemaining(this.roomCode()!).subscribe({
      next: ({ remaining }) => {
        this.loadingAttemptInfo.set(false);
      },
      error: () => {
        this.loadingAttemptInfo.set(false);
      },
    });
  }

  startGame() {
    this.resetClassification();
    this.gameStatus.set('loading');

    this.contentGenerationService
      .getRequirements()
      .pipe(
        switchMap((requirements) => {
          this.unclassifiedRequirements.set(requirements);

          return this.studentService.registerAttempt(
            this.roomCode()!,
            requirements.length
          );
        })
      )
      .subscribe(() => {
        this.gameStatus.set('started');
      });
  }

  resetClassification() {
    this.unclassifiedRequirements.set([]);
    this.selectedGoodRequirements.set([]);
    this.selectedBadRequirements.set([]);
  }

  navigateToCourses() {
    this.studentService.resetCurrentGameAttempt();
    this.router.navigate(['/courses']);
  }

  reloadGameAgain() {
    this.studentService.resetCurrentGameAttempt();
    this.gameStatus.set('not-started');
    this.checkRemainingAttempts();
  }
}
