import { MenuItem } from 'primeng/api';
import { User } from '@types';

export const navigationItems: Record<User['role'], MenuItem[]> = {
  student: [
    {
      label: 'Cursos',
      icon: 'pi pi-book',
      route: '/courses',
    },
    {
      label: 'Historial',
      icon: 'pi pi-history',
      route: '/history',
    },
  ],
  admin: [
    {
      label: 'Cursos',
      icon: 'pi pi-users',
      route: '/admin',
    },
    {
      label: 'Analíticas',
      icon: 'pi pi-chart-bar',
      route: '/admin/analytics',
    },
  ],
};
