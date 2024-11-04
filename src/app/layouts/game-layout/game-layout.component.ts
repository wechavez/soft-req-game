import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNavigationBarComponent } from '@components';

@Component({
  selector: 'app-game-layout',
  standalone: true,
  imports: [RouterOutlet, MainNavigationBarComponent],
  templateUrl: './game-layout.component.html',
  styles: ``,
})
export class GameLayoutComponent {}
