import { Routes } from '@angular/router';
import { isLoggedGuard, isNotLoggedGuard } from '@guards';
import { AuthLayoutComponent, GameLayoutComponent } from '@layouts';
import {
  AnalyticsComponent,
  HomeComponent,
  LoginComponent,
  RegisterComponent,
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
    path: 'play',
    canActivate: [isLoggedGuard],
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
    redirectTo: 'play',
  },
];
