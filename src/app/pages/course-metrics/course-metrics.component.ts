import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '@services/admin.service';
import { CourseMetrics } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { ChartConfiguration } from 'chart.js';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-course-metrics',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './course-metrics.component.html',
  styles: ``,
  host: {
    class: 'flex-1',
  },
})
export class CourseMetricsComponent implements OnInit {
  private adminService = inject(AdminService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  courseId = this.route.snapshot.params['room_id'];

  metrics: CourseMetrics | null = null;
  loading = true;

  chartLabels: string[] = [
    '0-1',
    '1-2',
    '2-3',
    '3-4',
    '4-5',
    '5-6',
    '6-7',
    '7-8',
    '8-9',
    '9-10',
  ];

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.chartLabels,
    datasets: [
      {
        label: 'Distribución de calificaciones',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Score Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Attempts',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Score Ranges',
        },
      },
    },
  };

  ngOnInit(): void {
    this.getCourseMetrics();
  }

  getCourseMetrics() {
    this.loading = true;
    this.adminService.getCourseMetrics(this.courseId).subscribe({
      next: (metrics) => {
        this.metrics = metrics;
        this.fetchScoreDistribution();
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
    });
  }

  fetchScoreDistribution(): void {
    if (!this.metrics) return;
    this.chartData.datasets[0].data = this.metrics?.grades_distribution.map(
      (item) => item.count
    );
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
