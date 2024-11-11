import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '@services';
import { Observable, map } from 'rxjs';
import { isLoggedGuard } from './is-logged.guard';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const isLogged = isLoggedGuard(route, state) as Observable<boolean>;
  const authService = inject(AuthService);
  const router = inject(Router);

  return isLogged.pipe(
    map((logged) => {
      const isAdmin = logged && authService.user()?.role === 'admin';
      if (!isAdmin) {
        router.navigateByUrl('/');
      }
      return isAdmin;
    })
  );
};
