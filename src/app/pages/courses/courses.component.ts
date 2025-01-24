import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmptyStateComponent } from '@components';
import { StudentService } from '@services';
import { PrimeNgModule } from '@ui/primeng.module';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    EmptyStateComponent,
  ],
  templateUrl: './courses.component.html',
})
export class CoursesComponent {
  private studentService = inject(StudentService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  enrolledCourses = this.studentService.enrolledCourses.asReadonly();

  loadingCourses = signal(false);
  enrollInProgress = signal(false);
  enrollDialogVisible = signal(false);
  courseAttemptLoading = signal<number | null>(null);

  enrollForm = inject(FormBuilder).group({
    course_code: ['', Validators.required],
  });

  ngOnInit() {
    if (!this.enrolledCourses()) {
      this.getEnrolledCourses();
    }
  }

  getEnrolledCourses() {
    this.loadingCourses.set(true);
    this.studentService.getEnrolledCourses().subscribe({
      next: () => {
        this.loadingCourses.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener los cursos',
        });
        this.loadingCourses.set(false);
      },
    });
  }

  enrollInCourse() {
    this.enrollInProgress.set(true);
    this.enrollForm.markAllAsTouched();
    if (this.enrollForm.invalid) return;

    const courseCode = this.enrollForm.get('course_code')?.value ?? '';

    this.studentService.enrollInCourse(courseCode).subscribe({
      next: () => {
        this.enrollInProgress.set(false);
        this.enrollDialogVisible.set(false);
        this.getEnrolledCourses();
      },
      error: (error) => {
        this.enrollInProgress.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  discardEnroll() {
    this.enrollForm.reset();
    this.enrollDialogVisible.set(false);
  }

  openEnrollDialog() {
    this.enrollForm.reset();
    this.enrollDialogVisible.set(true);
  }

  navigateToGame(courseId: number) {
    this.courseAttemptLoading.set(courseId);
    this.studentService.checkAttemptsRemaining(courseId).subscribe({
      next: ({ remaining }) => {
        if (remaining > 0) {
          this.router.navigate(['/game', courseId]);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No tienes más intentos disponibles en este curso',
          });
        }
        this.courseAttemptLoading.set(null);
      },
      error: (error) => {
        this.courseAttemptLoading.set(null);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }
}
