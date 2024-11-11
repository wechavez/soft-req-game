import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services';
import { catchError, of, switchMap, tap } from 'rxjs';

export const isNotLoggedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.refreshToken().pipe(
    switchMap((logged) => {
      if (logged) {
        router.navigateByUrl('/');
        return of(false);
      }

      return of(true);
    })
  );
};
