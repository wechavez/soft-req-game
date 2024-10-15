import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PrimeNgModule } from '../../ui/primeng.module';

@Component({
  selector: 'app-main-navigation-bar',
  standalone: true,
  imports: [PrimeNgModule, CommonModule],
  templateUrl: './main-navigation-bar.component.html',
})
export class MainNavigationBarComponent {
  navItems: MenuItem[] | undefined;
  menuItems: MenuItem[] | undefined;

  constructor(private router: Router) {}

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
      { label: 'Salir', icon: 'pi pi-sign-out' },
    ];
  }
}
