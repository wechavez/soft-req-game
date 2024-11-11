import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services';
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

  menuItems = signal<MenuItem[]>([
    { label: 'Opciones', icon: 'pi pi-cog' },
    {
      label: 'Salir',
      icon: 'pi pi-sign-out',
      command: () => {
        this.router.navigate(['auth', 'login']);
        this.authService.logout();
      },
    },
  ]);

  navItems = signal<MenuItem[]>(
    navigationItems[this.user()?.role || 'student']
  );
}
