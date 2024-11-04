import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  navItems: MenuItem[] | undefined;
  menuItems: MenuItem[] | undefined;

  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    this.navItems = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        route: '/',
      },
      {
        label: 'Analíticas',
        icon: 'pi pi-chart-bar',
        route: '/play/analytics',
      },
    ];

    this.menuItems = [
      { label: 'Opciones', icon: 'pi pi-cog' },
      {
        label: 'Salir',
        icon: 'pi pi-sign-out',
        command: () => {
          this.router.navigate(['auth', 'login']);
          this.authService.logout();
        },
      },
    ];
  }
}
