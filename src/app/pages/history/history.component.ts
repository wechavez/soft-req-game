import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TakenTimePipe } from '@pipes';
import { StudentService } from '@services';
import { AttemptRecord } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [PrimeNgModule, CommonModule, TakenTimePipe],
  templateUrl: './history.component.html',
  styles: ``,
})
export class HistoryComponent implements OnInit {
  studentService = inject(StudentService);
  router = inject(Router);
  attempts = signal<AttemptRecord[]>([]);

  loading = signal(true);
  attemptsTable = viewChild<Table>('attemptsTable');

  ngOnInit(): void {
    this.getHistory();
  }

  getHistory(): void {
    this.loading.set(true);
    this.studentService.getAttemptsHistory().subscribe((attempts) => {
      this.attempts.set(attempts);
      this.loading.set(false);
    });
  }

  search(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.attemptsTable()?.filterGlobal(value, 'contains');
  }

  navigateToCourses(): void {
    this.router.navigate(['/courses']);
  }
}
