import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthResponse, User } from '@types';
import { catchError, delay, Observable, of, switchMap, tap } from 'rxjs';

type AuthStatus = 'loading' | 'logged' | 'not-logged';

type AuthBasicParams = {
  email: string;
  password: string;
};

type AuthRegisterParams = AuthBasicParams & {
  first_name: string;
  last_name: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  authStatus = signal<AuthStatus>('loading');
  user = signal<User | undefined>(undefined);

  private readonly http = inject(HttpClient);

  constructor() {}

  login({ email, password }: AuthBasicParams) {
    const url = `${this.apiUrl}/auth/login`;

    return this.http
      .post<AuthResponse>(url, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          this.setAuthInfo(res);
        })
      );
  }

  register(params: AuthRegisterParams) {
    const { email, password, first_name, last_name } = params;
    const url = `${this.apiUrl}/auth/register`;

    return this.http
      .post<AuthResponse>(url, {
        email,
        password,
        first_name,
        last_name,
      })
      .pipe(
        tap((res) => {
          this.setAuthInfo(res);
        })
      );
  }

  refreshToken(): Observable<boolean> {
    const url = `${this.apiUrl}/auth/refresh-token`;

    this.authStatus.set('loading');

    return this.http.get<AuthResponse>(url).pipe(
      delay(1000),
      switchMap((res) => {
        this.setAuthInfo(res);
        return of(true);
      }),
      catchError((_) => {
        this.logout();
        return of(false);
      })
    );
  }

  logout() {
    this.authStatus.set('not-logged');
    this.user.set(undefined);
    localStorage.removeItem('token');
  }

  private setAuthInfo({ ok, token, user }: AuthResponse) {
    if (ok) {
      this.user.set(user);
      localStorage.setItem('token', token);
      this.authStatus.set('logged');
    } else {
      this.logout();
    }
  }

  cleanData() {
    this.user.set(undefined);
  }
}
