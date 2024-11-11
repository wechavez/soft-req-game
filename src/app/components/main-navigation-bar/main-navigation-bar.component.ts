import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services';
import { MenuItem } from 'primeng/api';
import { PrimeNgModule } from '@ui/primeng.module';

@Component({
  selector: 'app-main-navigation-bar',
  standalone: true,
  imports: [PrimeNgModule, CommonModule],
  templateUrl: './main-navigation-bar.component.html',
})
export class MainNavigationBarComponent {
  navItems = signal<MenuItem[]>([]);
  menuItems = signal<MenuItem[]>([]);

  authService = inject(AuthService);
  router = inject(Router);

  user = this.authService.user;

  ngOnInit() {
    if (this.user()?.role === 'student') {
      this.navItems.update((items) => [
        ...items,
        {
          label: 'Jugar',
          icon: 'pi pi-play-circle',
          route: '/play',
        },
        {
          label: 'Historial',
          icon: 'pi pi-history',
          route: '/play/history',
        },
      ]);
    }

    if (this.user()?.role === 'admin') {
      this.navItems.update((items) => [
        ...items,
        {
          label: 'Analíticas',
          icon: 'pi pi-chart-bar',
          route: '/play/analytics',
        },
        {
          label: 'Administrar',
          icon: 'pi pi-users',
          route: '/admin',
        },
      ]);
    }

    this.menuItems.set([
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
  }
}
