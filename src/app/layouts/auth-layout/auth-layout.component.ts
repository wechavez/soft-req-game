import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNgModule } from '../../ui/primeng.module';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, PrimeNgModule],
  templateUrl: './auth-layout.component.html',
  styles: ``,
})
export class AuthLayoutComponent {}
