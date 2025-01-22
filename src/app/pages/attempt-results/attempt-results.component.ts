import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequirementResultItemComponent } from '@components';
import { AdminService } from '@services';
import { RequirementAttemptResult } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';

@Component({
  selector: 'app-attempt-results',
  standalone: true,
  imports: [CommonModule, RequirementResultItemComponent, PrimeNgModule],
  templateUrl: './attempt-results.component.html',
  styles: ``,
})
export class AttemptResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private adminService = inject(AdminService);

  loading = signal<boolean>(false);
  attemptId = signal<number | null>(null);
  results = signal<RequirementAttemptResult[]>([]);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.attemptId.set(+params['attemptId']);
    });

    this.getAttemptResults();
  }

  getAttemptResults() {
    this.loading.set(true);
    this.adminService
      .getAttemptResults(this.attemptId()!)
      .subscribe((results) => {
        this.results.set(results);
        this.loading.set(false);
      });
  }

  backToPreviousPage() {
    window.history.back();
  }
}
