import { MenuItem } from 'primeng/api';
import { User } from '@types';

export const navigationItems: Record<User['role'], MenuItem[]> = {
  student: [
    {
      label: 'Jugar',
      icon: 'pi pi-play-circle',
      route: '/',
    },
    {
      label: 'Historial',
      icon: 'pi pi-history',
      route: '/history',
    },
  ],
  admin: [
    {
      label: 'Analíticas',
      icon: 'pi pi-chart-bar',
      route: '/admin/analytics',
    },
    {
      label: 'Administrar',
      icon: 'pi pi-users',
      route: '/admin',
    },
  ],
};
