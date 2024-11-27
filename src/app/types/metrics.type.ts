export interface CourseMetrics {
  score_average: number;
  time_average: number;
  dropout_rate: number;
  grades_distribution: GradesDistribution[];
  total_attempts: number;
}

export interface GradesDistribution {
  score_range: string;
  count: number;
}
