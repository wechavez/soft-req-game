import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonPageHeaderSkeletonComponent } from '@components';
import { ParseHtmlPipe } from '@pipes';
import { AdminService } from '@services';
import { Requirement } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { TableEditCompleteEvent } from 'primeng/table';
import * as XLSX from 'xlsx';

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
  private confirmationService = inject(ConfirmationService);

  messages: Message[] = [
    {
      severity: 'info',
      summary: 'Editar',
      detail:
        'Puedes editar el contenido de los requerimientos y su validez dando click en el campo que deseas editar',
    },
  ];

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

  checkIfRequirementChanged(requirement: Requirement) {
    const originalRequirement = this.requirements().find(
      (req) => req.id === requirement.id
    );
    return (
      originalRequirement?.text !== requirement.text ||
      originalRequirement?.isValid !== requirement.isValid ||
      originalRequirement?.feedback !== requirement.feedback
    );
  }

  onUpdateRequirement(ev: TableEditCompleteEvent) {
    const { index } = ev;
    if (index === undefined) return;
    const requirementToUpdate = this.requirements()[index];
    if (!requirementToUpdate) return;

    if (!this.checkIfRequirementChanged(requirementToUpdate)) return;

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

  downloadRequirementsList() {
    const formattedRequirements = this.requirements().map((req) => ({
      requirement: req.text,
      isValid: req.isValid ? 1 : 0,
      feedback: req.feedback,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedRequirements);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Requerimientos ${this.course()?.course_code}`
    );
    XLSX.writeFile(
      workbook,
      `${this.course()?.course_code} - Banco de Requerimientos.xlsx`
    );

    this.messageService.add({
      severity: 'success',
      summary: 'Descargado',
      detail: 'Archivo descargado correctamente',
    });
  }

  removeRequirement(requirementId: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de querer eliminar este requerimiento?',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      header: 'Eliminar requerimiento',
      accept: () => {
        this.adminService
          .removeRequirement({
            courseId: this.courseId()!,
            requirementId,
          })
          .subscribe({
            next: () => {
              this.requirements.update((requirements) =>
                requirements.filter((req) => req.id !== requirementId)
              );
              this.messageService.add({
                severity: 'success',
                summary: 'Eliminado',
                detail: 'Requerimiento eliminado correctamente',
              });
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error al eliminar',
                detail: 'Ocurrió un error al eliminar el requerimiento',
              });
            },
          });
      },
    });
  }
}
