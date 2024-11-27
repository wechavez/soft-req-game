import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService, StudentService } from '@services';
import { EnrolledCourse, Room } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, PrimeNgModule, ReactiveFormsModule],
  templateUrl: './courses.component.html',
  styles: ``,
  host: {
    class: 'block h-full',
  },
})
export class CoursesComponent {
  private studentService = inject(StudentService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  rooms = signal<EnrolledCourse[]>([]);

  loadingCourses = signal(true);
  enrollInProgress = signal(false);
  enrollDialogVisible = signal(false);
  courseAttemptLoading = signal<string | null>(null);

  enrollForm = inject(FormBuilder).group({
    room_code: ['', Validators.required],
  });

  ngOnInit() {
    this.getEnrolledCourses();
  }

  getEnrolledCourses() {
    this.loadingCourses.set(true);
    this.studentService.getEnrolledCourses().subscribe({
      next: (rooms) => {
        this.rooms.set(rooms);
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

    const roomCode = this.enrollForm.get('room_code')?.value ?? '';

    this.studentService.enrollInCourse(roomCode).subscribe({
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

  navigateToGame(roomCode: string) {
    this.courseAttemptLoading.set(roomCode);
    this.studentService.checkAttemptsRemaining(roomCode).subscribe({
      next: ({ remaining }) => {
        if (remaining > 0) {
          this.router.navigate(['/game', roomCode]);
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
