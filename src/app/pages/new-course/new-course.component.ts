import { Component, inject, signal } from '@angular/core';
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

  createLoading = signal(false);

  languages = signal<Language[]>([
    { name: 'Español', code: 'es' },
    { name: 'Inglés', code: 'en' },
  ]);

  roomForm = new FormGroup({
    room_code: new FormControl('', [Validators.required]),
    room_name: new FormControl('', [Validators.required]),
    max_attempts: new FormControl(1, [Validators.required]),
    items_per_attempt: new FormControl(5, [Validators.required]),
    language: new FormControl(this.languages()[0], [Validators.required]),
    additional_context: new FormControl('', []),
  });

  createRoom() {
    const createRoomDto: CreateRoomDto = {
      room_code: this.roomForm.get('room_code')?.value ?? '',
      room_name: this.roomForm.get('room_name')?.value ?? '',
      max_attempts: this.roomForm.get('max_attempts')?.value ?? 1,
      items_per_attempt: this.roomForm.get('items_per_attempt')?.value ?? 5,
      language: this.roomForm.get('language')?.value?.code ?? '',
      additional_context: this.roomForm.get('additional_context')?.value ?? '',
    };

    this.createLoading.set(true);
    this.adminService.createRoom(createRoomDto).subscribe((room) => {
      this.createLoading.set(false);
      this.navigateToAdminHome();
    });
  }

  onSubmit() {
    if (this.roomForm.invalid) return;
    this.createRoom();
  }

  navigateToAdminHome() {
    this.router.navigate(['admin']);
  }
}
