import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '@services/admin.service';
import { AuthService } from '@services/auth.service';
import { CreateRoomDto, Room } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, PrimeNgModule, ReactiveFormsModule],
  templateUrl: './adminHome.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .container {
      width: 100%;
      max-width: 1024px;
      margin: 0 auto;
    }
  `,
})
export class AdminHomeComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private authService = inject(AuthService);

  rooms = signal<Room[]>([]);

  visible: boolean = false;

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

  roomForm = new FormGroup({
    room_code: new FormControl('', [Validators.required]),
    room_name: new FormControl('', [Validators.required]),
    max_attempts: new FormControl(1, [Validators.required]),
  });

  showDialog() {
    this.visible = true;
  }

  ngOnInit() {
    this.adminService.getRooms().subscribe((rooms) => {
      this.rooms.set(rooms);
    });
  }

  createRoom() {
    const createRoomDto: CreateRoomDto = {
      room_code: this.roomForm.get('room_code')?.value ?? '',
      room_name: this.roomForm.get('room_name')?.value ?? '',
      max_attempts: this.roomForm.get('max_attempts')?.value ?? 1,
    };

    this.adminService.createRoom(createRoomDto).subscribe((room) => {
      this.rooms.set([...this.rooms(), room]);
      this.visible = false;
    });
  }

  onSubmit() {
    if (this.roomForm.invalid) return;
    this.createRoom();
  }
}
