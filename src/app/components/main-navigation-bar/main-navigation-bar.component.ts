import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, AuthService, StudentService } from '@services';
import { PrimeNgModule } from '@ui/primeng.module';
import { MenuItem } from 'primeng/api';
import { navigationItems } from './navigationItems';

@Component({
  selector: 'app-main-navigation-bar',
  standalone: true,
  imports: [PrimeNgModule, CommonModule],
  templateUrl: './main-navigation-bar.component.html',
})
export class MainNavigationBarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  user = this.authService.user;
  studentService = inject(StudentService);
  adminService = inject(AdminService);

  userName = computed(
    () => `${this.user()?.first_name} ${this.user()?.last_name}`
  );

  menuItems = signal<MenuItem[]>([
    {
      label: 'Salir',
      icon: 'pi pi-sign-out',
      command: () => {
        this.authService.logout();
        this.router.navigate(['auth', 'login']);
        this.cleanSessionData();
      },
    },
  ]);

  navItems = signal<MenuItem[]>(
    navigationItems[this.user()?.role || 'student']
  );

  cleanSessionData() {
    this.authService.cleanData();
    this.studentService.cleanData();
    this.adminService.cleanData();
  }
}
