import { Routes } from '@angular/router';
import { isAdminGuard, isNotLoggedGuard, isStudentGuard } from '@guards';
import {
  AdminLayoutComponent,
  AuthLayoutComponent,
  GameLayoutComponent,
} from '@layouts';
import {
  HomeComponent,
  LoginComponent,
  RegisterComponent,
  AdminHomeComponent,
  CoursesComponent,
  HistoryComponent,
  CourseMetricsComponent,
  NewCourseComponent,
  RequirementsListComponent,
  StudentListComponent,
  AttemptResultsComponent,
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
        path: 'course-metrics/:courseId',
        component: CourseMetricsComponent,
      },
      {
        path: 'student-list/:courseId',
        component: StudentListComponent,
      },
      {
        path: 'student-history/:courseId/:studentId',
        component: HistoryComponent,
      },
      {
        path: 'attempt-results/:attemptId',
        component: AttemptResultsComponent,
      },
      {
        path: 'new-course',
        component: NewCourseComponent,
      },
      {
        path: 'requirements-list/:courseId',
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
        path: 'game/:courseId',
        component: HomeComponent,
      },
      {
        path: 'history',
        component: HistoryComponent,
      },
      {
        path: 'attempt-results/:attemptId',
        component: AttemptResultsComponent,
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
