import { Routes } from '@angular/router';
import { isAdminGuard, isNotLoggedGuard, isStudentGuard } from '@guards';
import { AuthLayoutComponent, GameLayoutComponent } from '@layouts';
import {
  AnalyticsComponent,
  HomeComponent,
  LoginComponent,
  RegisterComponent,
  AdminHomeComponent,
} from '@pages';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [isNotLoggedGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [isAdminGuard],
    component: GameLayoutComponent,
    children: [
      {
        path: '',
        component: AdminHomeComponent,
      },
    ],
  },
  {
    path: '',
    canActivate: [isStudentGuard],
    component: GameLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'analytics',
        component: AnalyticsComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
