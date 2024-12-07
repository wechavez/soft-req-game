import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonPageHeaderSkeletonComponent } from '@components';
import { ParseHtmlPipe } from '@pipes';
import { AdminService } from '@services';
import { Requirement } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { MessageService } from 'primeng/api';
import { TableEditCompleteEvent } from 'primeng/table';

@Component({
  selector: 'app-requirements-list',
  standalone: true,
  imports: [
    PrimeNgModule,
    ParseHtmlPipe,
    FormsModule,
    CommonPageHeaderSkeletonComponent,
  ],
  templateUrl: './requirements-list.component.html',
  styles: ``,
})
export class RequirementsListComponent {
  private router = inject(Router);
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  courseId = signal<number | null>(null);
  course = computed(() =>
    this.adminService.adminCourses()?.find((c) => c.id === this.courseId())
  );

  loadingRequirements = signal(true);
  loadingCourses = signal(false);

  requirements = signal<Requirement[]>([]);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.courseId.set(+params['courseId']);
    });

    if (!this.courseId()) {
      this.router.navigate(['/courses']);
      return;
    }

    if (!this.adminService.adminCourses()) {
      this.getCourses();
    }

    this.getRequirements();
  }

  getCourses() {
    this.loadingCourses.set(true);
    this.adminService.getCourses().subscribe(() => {
      this.loadingCourses.set(false);
    });
  }

  getRequirements() {
    this.loadingRequirements.set(true);
    this.adminService
      .getGeneratedRequirements(this.courseId()!)
      .subscribe((requirements) => {
        this.requirements.set(requirements);
        this.loadingRequirements.set(false);
      });
  }

  navigateToAdminHome() {
    this.router.navigate(['admin']);
  }

  onUpdateRequirement(ev: TableEditCompleteEvent) {
    const { index } = ev;
    if (index === undefined) return;
    const requirementToUpdate = this.requirements()[index];
    if (!requirementToUpdate) return;

    this.adminService.updateRequirement(requirementToUpdate).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Requerimiento actualizado correctamente',
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al actualizar',
          detail: error.error.message,
        });
      },
    });
  }
}
