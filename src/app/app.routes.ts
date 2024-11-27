import { Routes } from '@angular/router';
import { isAdminGuard, isNotLoggedGuard, isStudentGuard } from '@guards';
import {
  AdminLayoutComponent,
  AuthLayoutComponent,
  GameLayoutComponent,
} from '@layouts';
import {
  AnalyticsComponent,
  HomeComponent,
  LoginComponent,
  RegisterComponent,
  AdminHomeComponent,
  CoursesComponent,
  HistoryComponent,
  CourseMetricsComponent,
  NewCourseComponent,
  RequirementsListComponent,
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
    component: AdminLayoutComponent,
    canActivate: [isAdminGuard],
    children: [
      {
        path: '',
        component: AdminHomeComponent,
      },
      {
        path: 'course-metrics/:room_id',
        component: CourseMetricsComponent,
      },
      {
        path: 'new-course',
        component: NewCourseComponent,
      },
      {
        path: 'requirements-list/:room_id',
        component: RequirementsListComponent,
      },
    ],
  },
  {
    path: '',
    canActivate: [isStudentGuard],
    component: GameLayoutComponent,
    children: [
      {
        path: 'courses',
        component: CoursesComponent,
      },
      {
        path: 'game/:room_code',
        component: HomeComponent,
      },
      {
        path: 'analytics',
        component: AnalyticsComponent,
      },
      {
        path: 'history',
        component: HistoryComponent,
      },
      {
        path: '**',
        redirectTo: 'courses',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
