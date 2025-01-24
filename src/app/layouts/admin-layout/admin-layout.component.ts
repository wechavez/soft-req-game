import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MainNavigationBarComponent } from '@components';
import { AuthService } from '@services';
import { PrimeNgModule } from '@ui/primeng.module';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [PrimeNgModule, RouterOutlet, MainNavigationBarComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

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
}
