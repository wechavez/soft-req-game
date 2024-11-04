import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { PrimeNgModule } from '@ui/primeng.module';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styles: ``,
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  messageService = inject(MessageService);

  form = this.fb.group({
    first_name: ['', []],
    last_name: ['', []],
    email: ['', [Validators.email]],
    password: ['', []],
  });

  showError(errorMessage?: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error al registrar',
      detail: errorMessage || 'No pudimos validar tus información.',
    });
  }

  register() {
    if (this.form.invalid) return;

    const { email, password, first_name, last_name } = this.form.value;

    this.authService
      .register({
        first_name: first_name || '',
        last_name: last_name || '',
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
