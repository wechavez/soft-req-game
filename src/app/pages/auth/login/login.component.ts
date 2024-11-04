import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services';
import { PrimeNgModule } from '@ui/primeng.module';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  messageService = inject(MessageService);

  form = this.fb.group({
    email: ['', [Validators.email]],
    password: ['', []],
  });

  showError(errorMessage?: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error al ingresar',
      detail: errorMessage || 'No pudimos validar tus credenciales.',
    });
  }

  login() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.authService
      .login({
        email: email || '',
        password: password || '',
      })
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (resp) => {
          const message = resp.error.message;
          this.showError(message);
        },
      });
  }
}
