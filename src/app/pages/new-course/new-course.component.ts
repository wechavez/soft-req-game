import { Component, computed, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '@services/admin.service';
import { CreateCourseDto, CreateRequirementDto, Requirement } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { MessageService } from 'primeng/api';
import { FileSelectEvent } from 'primeng/fileupload';
import * as XLSX from 'xlsx';

type Language = {
  name: string;
  code: string;
};

type FileData = {
  requirement: string;
  isValid: string;
  feedback: string;
};

@Component({
  selector: 'app-new-course',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule],
  templateUrl: './new-course.component.html',
  styles: ``,
})
export class NewCourseComponent {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  createLoading = signal(false);

  activeTab = signal(0);
  contentMode = computed(() =>
    this.activeTab() === 0 ? 'generated' : 'file_upload'
  );

  languages = signal<Language[]>([
    { name: 'Español', code: 'es' },
    { name: 'Inglés', code: 'en' },
  ]);

  defaultLanguage = computed(() => this.languages()[0]);

  courseForm = new FormGroup({
    course_code: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[^\s]+$/),
    ]),
    course_name: new FormControl('', [Validators.required]),
    max_attempts: new FormControl(1, [Validators.required]),
    items_per_attempt: new FormControl(5, [Validators.required]),
    language: new FormControl(this.defaultLanguage()),
    additional_context: new FormControl(''),
  });

  requirements = signal<CreateRequirementDto[]>([]);

  createCourse(createCourseDto: CreateCourseDto) {
    this.createLoading.set(true);
    this.messageService.add({
      severity: 'info',
      summary: 'Creando Curso',
      sticky: true,
      icon: 'pi pi-spin pi-spinner',
      detail:
        'Se está creando el curso y generando el contenido, esto puede tardar unos minutos. Una vez finalice, se te redirigirá al panel de administración.',
    });
    this.adminService.createCourse(createCourseDto).subscribe({
      next: () => {
        this.createLoading.set(false);
        this.messageService.clear();
        this.adminService.getCourses().subscribe();
        this.navigateToAdminHome();
      },
      error: (error) => {
        this.createLoading.set(false);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  isValidFileUploaded(): boolean {
    if (this.contentMode() === 'file_upload') {
      if (this.requirements().length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Debes cargar un archivo con el banco de requerimientos.',
        });
        return false;
      }
    }

    return true;
  }

  onSubmit() {
    if (this.courseForm.invalid) return;
    if (!this.isValidFileUploaded()) return;

    const createCourseDto: CreateCourseDto = {
      course_code: this.courseForm.get('course_code')?.value ?? '',
      course_name: this.courseForm.get('course_name')?.value ?? '',
      max_attempts: this.courseForm.get('max_attempts')?.value ?? 1,
      items_per_attempt: this.courseForm.get('items_per_attempt')?.value ?? 5,
      language: this.courseForm.get('language')?.value?.code ?? '',
      additional_context:
        this.courseForm.get('additional_context')?.value ?? '',
      content_mode: this.contentMode(),
      requirements: this.requirements(),
    };

    this.createCourse(createCourseDto);
  }

  navigateToAdminHome() {
    this.router.navigate(['admin']);
  }

  onSelect(event: FileSelectEvent) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: 'buffer' });
        const sheetNameList = workbook.SheetNames;
        const data: FileData[][] = sheetNameList.map((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const data: FileData[] = XLSX.utils.sheet_to_json(worksheet);
          this.validateFileStructure(data);
          this.validateFileContent(data);
          return data;
        });
        const requirementsData = data.flat();
        const requirements = this.parseFileContent(requirementsData);
        this.requirements.set(requirements);
      } catch (error: any) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      }
    };

    reader.readAsArrayBuffer(file);
  }

  parseFileContent(data: FileData[]) {
    const requirements: CreateRequirementDto[] = data.map((item) => {
      return {
        text: item.requirement,
        isValid: Boolean(item.isValid),
        feedback: item.feedback,
      };
    });

    return requirements;
  }

  validateFileStructure(data: FileData[]) {
    const requiredColumns = ['requirement', 'isValid', 'feedback'];
    const dataColumns = Object.keys(data[0] as object);

    requiredColumns.forEach((column) => {
      if (!dataColumns.includes(column)) {
        throw new Error(
          `El archivo no contiene la columna requerida: ${column}`
        );
      }
    });
  }

  validateFileContent(data: FileData[]) {
    data.forEach((item, index) => {
      if (typeof item.requirement !== 'string') {
        throw new Error(
          `El texto en la fila ${index + 1} debe ser una cadena de caracteres`
        );
      }
      if (
        typeof item.isValid !== 'number' ||
        (item.isValid !== 1 && item.isValid !== 0)
      ) {
        throw new Error(
          `El campo isValid en la fila ${index + 1} debe ser un número 1 o 0`
        );
      }
      if (typeof item.feedback !== 'string') {
        throw new Error(
          `El campo feedback en la fila ${
            index + 1
          } debe ser una cadena de caracteres`
        );
      }
    });
  }

  downloadTemplate() {
    this.adminService.downloadTemplate();
  }
}
