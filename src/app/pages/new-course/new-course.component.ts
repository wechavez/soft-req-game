import { Component, computed, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '@services/admin.service';
import { CreateRoomDto } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { MessageService } from 'primeng/api';

type Language = {
  name: string;
  code: string;
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

  languages = signal<Language[]>([
    { name: 'Español', code: 'es' },
    { name: 'Inglés', code: 'en' },
  ]);

  defaultLanguage = computed(() => this.languages()[0]);

  courseForm = new FormGroup({
    room_code: new FormControl('', [Validators.required]),
    room_name: new FormControl('', [Validators.required]),
    max_attempts: new FormControl(1, [Validators.required]),
    items_per_attempt: new FormControl(5, [Validators.required]),
    language: new FormControl(this.defaultLanguage(), [Validators.required]),
    additional_context: new FormControl(''),
  });

  createRoom(createRoomDto: CreateRoomDto) {
    this.createLoading.set(true);
    this.messageService.add({
      severity: 'info',
      summary: 'Creando Curso',
      sticky: true,
      icon: 'pi pi-spin pi-spinner',
      detail:
        'Se está creando el curso y generando el contenido, esto puede tardar unos minutos. Una vez finalice, se te redirigirá al panel de administración.',
    });
    this.adminService.createRoom(createRoomDto).subscribe({
      next: () => {
        this.createLoading.set(false);
        this.messageService.clear();
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

  onSubmit() {
    if (this.courseForm.invalid) return;

    const createRoomDto: CreateRoomDto = {
      room_code: this.courseForm.get('room_code')?.value ?? '',
      room_name: this.courseForm.get('room_name')?.value ?? '',
      max_attempts: this.courseForm.get('max_attempts')?.value ?? 1,
      items_per_attempt: this.courseForm.get('items_per_attempt')?.value ?? 5,
      language: this.courseForm.get('language')?.value?.code ?? '',
      additional_context:
        this.courseForm.get('additional_context')?.value ?? '',
    };

    this.createRoom(createRoomDto);
  }

  navigateToAdminHome() {
    this.router.navigate(['admin']);
  }
}
