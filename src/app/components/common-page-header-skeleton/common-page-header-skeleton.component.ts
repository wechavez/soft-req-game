import { Component } from '@angular/core';
import { PrimeNgModule } from '@ui/primeng.module';

@Component({
  selector: 'app-common-page-header-skeleton',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './common-page-header-skeleton.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class CommonPageHeaderSkeletonComponent {}
