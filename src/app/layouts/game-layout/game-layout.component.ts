import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNavigationBarComponent } from '@components';

@Component({
  selector: 'app-game-layout',
  standalone: true,
  imports: [RouterOutlet, MainNavigationBarComponent],
  templateUrl: './game-layout.component.html',
  styles: `
    .container {
      width: 100%;
      max-width: 1024px;
      margin: 0 auto;
      height: 100vh;
    }

    .outlet {
      height: calc(100% - 77px);
    }
  `,
})
export class GameLayoutComponent {}
