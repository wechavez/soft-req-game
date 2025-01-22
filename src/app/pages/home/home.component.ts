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
import { MessageService } from 'primeng/api';

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
})
export class HomeComponent implements OnInit {
  contentGenerationService = inject(ContentGenerationService);
  studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loadingAttemptInfo = signal(false);
  loadingEnrolledCourses = signal(false);

  unclassifiedRequirements = model<Requirement[]>([]);
  selectedGoodRequirements = model<Requirement[]>([]);
  selectedBadRequirements = model<Requirement[]>([]);

  courseId = signal<number | null>(null);

  gameStatus = model<GameStatus>('not-started');

  remainingAttempts = computed(
    () => this.studentService.currentGameAttempt()?.remaining
  );
  enrolledCourses = this.studentService.enrolledCourses.asReadonly();

  pageCourse = computed(() =>
    this.enrolledCourses()?.find((course) => course.id === this.courseId())
  );

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.courseId.set(+params['courseId']);
    });

    if (!this.courseId()) {
      this.router.navigate(['/courses']);
      return;
    }

    if (!this.remainingAttempts()) {
      this.checkRemainingAttempts();
    }

    if (!this.enrolledCourses()) {
      this.getEnrolledCourses();
    }
  }

  checkRemainingAttempts() {
    this.loadingAttemptInfo.set(true);
    this.studentService.checkAttemptsRemaining(this.courseId()!).subscribe({
      next: () => {
        this.loadingAttemptInfo.set(false);
      },
      error: () => {
        this.loadingAttemptInfo.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener los intentos restantes',
        });
      },
    });
  }

  getEnrolledCourses() {
    this.loadingEnrolledCourses.set(true);
    this.studentService.getEnrolledCourses().subscribe({
      next: () => {
        this.loadingEnrolledCourses.set(false);
      },
      error: () => {
        this.loadingEnrolledCourses.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener los cursos',
        });
      },
    });
  }

  startGame() {
    this.resetClassification();
    this.gameStatus.set('loading');

    this.contentGenerationService
      .getRequirements(this.courseId()!)
      .pipe(
        switchMap((requirements) => {
          this.unclassifiedRequirements.set(requirements);

          return this.studentService.registerAttempt({
            courseId: this.courseId()!,
            totalRequirements: requirements.length,
            requirements: requirements.map((requirement) => ({
              id: requirement.id,
              result: 'not-classified',
            })),
          });
        })
      )
      .subscribe({
        next: () => {
          this.gameStatus.set('started');
        },
        error: () => {
          this.gameStatus.set('not-started');
        },
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

  startNewGame() {
    this.studentService.resetCurrentGameAttempt();
    this.gameStatus.set('not-started');
    this.checkRemainingAttempts();

    this.startGame();
  }
}
