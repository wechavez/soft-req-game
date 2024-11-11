import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services';
import { tap } from 'rxjs';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.refreshToken().pipe(
    tap((logged) => {
      if (!logged) {
        router.navigateByUrl('/auth/login');
      }
    })
  );
};
