import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '@services/admin.service';
import { AuthService } from '@services/auth.service';
import { Course } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

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

  courses = computed(() => this.adminService.adminCourses() || []);

  loading = signal(false);

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

  getCourses() {
    this.loading.set(true);
    this.adminService.getCourses().subscribe((courses) => {
      this.loading.set(false);
    });
  }

  removeCourse(courseId: string) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de querer eliminar este curso?',
      header: 'Eliminar curso',
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
}
