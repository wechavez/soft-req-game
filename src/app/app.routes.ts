import { Routes } from '@angular/router';
import {
  AnalyticsComponent,
  HomeComponent,
  LoginComponent,
  RegisterComponent,
} from './pages';
import { AuthLayoutComponent, GameLayoutComponent } from './layouts';

export const routes: Routes = [
  {
    path: 'play',
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
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'play',
  },
];
