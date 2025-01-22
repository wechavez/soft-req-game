import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '@services/admin.service';
import { AuthService } from '@services/auth.service';
import { Course, EditCourseDto } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import {
  ConfirmationService,
  MenuItem,
  Message,
  MessageService,
} from 'primeng/api';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, PrimeNgModule, ReactiveFormsModule],
  templateUrl: './adminHome.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHomeComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  editCourseForm = new FormGroup({
    course_name: new FormControl('', [Validators.required]),
    max_attempts: new FormControl(1, [Validators.required]),
    items_per_attempt: new FormControl(1, [Validators.required]),
  });
  courseIdToEdit = signal<number | null>(null);
  courseEditMessages = signal<Message[]>([]);

  courses = computed(() => this.adminService.adminCourses() || []);

  loading = signal(false);
  checkAttemptsLoading = signal(false);
  editCourseLoading = signal(false);
  editCourseModalVisible = signal(false);

  menuItems = signal<MenuItem[]>([
    {
      label: 'Salir',
      icon: 'pi pi-sign-out',
      command: () => {
        this.router.navigate(['auth', 'login']);
        this.authService.logout();
      },
    },
  ]);

  ngOnInit() {
    if (!this.adminService.adminCourses()) {
      this.getCourses();
    }
  }

  navigateToCourseStats(courseId: string) {
    this.router.navigate(['admin', 'course-metrics', courseId]);
  }

  navigateToNewCourse() {
    this.router.navigate(['admin', 'new-course']);
  }

  navigateToRequirementsList(courseId: string) {
    this.router.navigate(['admin', 'requirements-list', courseId]);
  }

  isCheckingAttempts(courseId: number) {
    return this.checkAttemptsLoading() && this.courseIdToEdit() === courseId;
  }

  getCourses() {
    this.loading.set(true);
    this.adminService.getCourses().subscribe((courses) => {
      this.loading.set(false);
    });
  }

  removeCourse(courseId: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de querer eliminar este curso?',
      header: 'Eliminar curso',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.adminService.removeCourse(courseId).subscribe({
          next: () => {
            this.getCourses();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el curso',
            });
          },
        });
      },
    });
  }

  openEditCourseModal(courseId: number) {
    this.courseIdToEdit.set(courseId);
    this.checkAttemptsLoading.set(true);
    this.adminService.checkIfThereIsAnyAttemptInCourse(courseId).subscribe({
      next: (hasAttempts) => {
        this.checkAttemptsLoading.set(false);
        this.courseEditMessages.set(
          hasAttempts
            ? [
                {
                  severity: 'info',
                  summary: 'Atención',
                  detail: 'En este curso ya existen intentos de evaluación.',
                },
              ]
            : []
        );

        const course = this.courses().find((c) => c.id === courseId);
        this.editCourseForm.patchValue({
          course_name: course?.course_name,
          max_attempts: course?.max_attempts,
          items_per_attempt: course?.items_per_attempt,
        });
        this.editCourseModalVisible.set(true);
      },
      error: () => {
        this.checkAttemptsLoading.set(false);
      },
    });
  }

  closeEditCourseModal() {
    this.editCourseModalVisible.set(false);
    this.courseIdToEdit.set(null);
    this.editCourseForm.reset();
  }

  onEditCourse() {
    if (this.editCourseForm.invalid) {
      this.editCourseForm.markAllAsTouched();
      return;
    }

    const courseId = this.courseIdToEdit();
    if (!courseId) return;

    const course = this.editCourseForm.value as EditCourseDto;
    this.editCourseLoading.set(true);
    this.adminService.editCourse(+courseId, course).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Curso editado correctamente',
        });
        this.getCourses();
        this.closeEditCourseModal();
        this.editCourseLoading.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al editar el curso',
        });
        this.editCourseLoading.set(false);
      },
    });
  }

  navigateToStudentList(courseId: number) {
    this.router.navigate(['admin', 'student-list', courseId]);
  }
}
