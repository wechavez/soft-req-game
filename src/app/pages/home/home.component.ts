import { CommonModule } from '@angular/common';
import { Component, inject, model, OnInit, signal } from '@angular/core';
import { GameResultsComponent } from '@components';
import { ContentGenerationService } from '@services';
import { GameStatus, Requirement } from '@types';
import { RequirementResult } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { GameClassificationComponent } from '../../components/game-classification/game-classification.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PrimeNgModule,
    CommonModule,
    GameResultsComponent,
    GameClassificationComponent,
  ],

  templateUrl: './home.component.html',
  styles: [
    `
      :host ::ng-deep {
        [pDraggable] {
          cursor: move;
        }
      }
    `,
  ],
  host: {
    class: 'flex flex-1 justify-content-center',
  },
})
export class HomeComponent implements OnInit {
  contentGenerationService = inject(ContentGenerationService);

  unclassifiedRequirements = model<Requirement[]>([]);
  selectedGoodRequirements = model<Requirement[]>([]);
  selectedBadRequirements = model<Requirement[]>([]);

  gameStatus = model<GameStatus>('not-started');

  ngOnInit(): void {
    // this.startGame();
  }

  startGame() {
    this.resetClassification();
    this.gameStatus.set('loading');

    this.contentGenerationService
      .getRequirements()
      .subscribe((requirements) => {
        this.unclassifiedRequirements.set(requirements);
        this.gameStatus.set('started');
      });
  }

  resetClassification() {
    this.unclassifiedRequirements.set([]);
    this.selectedGoodRequirements.set([]);
    this.selectedBadRequirements.set([]);
  }
}
