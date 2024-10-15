import { Component } from '@angular/core';
import { PrimeNgModule } from '@ui/primeng.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {}
