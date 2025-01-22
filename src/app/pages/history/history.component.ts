import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonPageHeaderSkeletonComponent } from '@components';
import { TakenTimePipe } from '@pipes';
import { AdminService, StudentService } from '@services';
import { AttemptRecord, User } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    PrimeNgModule,
    CommonModule,
    TakenTimePipe,
    CommonPageHeaderSkeletonComponent,
  ],
  templateUrl: './history.component.html',
  styles: ``,
})
export class HistoryComponent implements OnInit {
  studentService = inject(StudentService);
  adminService = inject(AdminService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  attempts = signal<AttemptRecord[]>([]);

  studentId = signal<number | null>(null);
  courseId = signal<number | null>(null);
  student = signal<User | null>(null);
  loadingHistory = signal(true);
  loadingStudent = signal(true);
  attemptsTable = viewChild<Table>('attemptsTable');

  isInAdminView = computed(
    () => this.studentId() !== null && this.courseId() !== null
  );

  studentName = computed(() =>
    this.student()
      ? `${this.student()?.first_name} ${this.student()?.last_name}`
      : ''
  );

  pageTitle = computed(() =>
    this.isInAdminView()
      ? `Historial de Intentos del Estudiante ${this.studentName()}`
      : 'Historial de Intentos'
  );

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.studentId.set(+params['studentId']);
      this.courseId.set(+params['courseId']);
    });

    this.prepareContent();
  }

  prepareContent(): void {
    this.getHistory({
      studentId: this.studentId()!,
      courseId: this.courseId()!,
    });

    if (this.isInAdminView()) {
      this.getStudentById(this.studentId()!);
    }
  }

  getHistory({
    studentId,
    courseId,
  }: {
    studentId?: number;
    courseId?: number;
  }): void {
    this.loadingHistory.set(true);
    this.studentService
      .getAttemptsHistory({ studentId, courseId })
      .subscribe((attempts) => {
        this.attempts.set(attempts);
        this.loadingHistory.set(false);
      });
  }

  getStudentById(studentId: number): void {
    this.loadingStudent.set(true);
    this.adminService.getStudentById(studentId).subscribe((student) => {
      this.student.set(student);
      this.loadingStudent.set(false);
    });
  }

  search(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.attemptsTable()?.filterGlobal(value, 'contains');
  }

  navigateToCourses(): void {
    if (this.isInAdminView()) {
      this.router.navigate(['admin', 'student-list', this.courseId()!]);
    } else {
      this.router.navigate(['/courses']);
    }
  }

  navigateToResults(attemptId: number): void {
    this.router.navigate(['admin', 'attempt-results', attemptId]);
  }

  downloadStudentAttemptList(): void {
    const attempts = this.attempts().map((attempt) => ({
      'Id del Intento': attempt.id,
      'Fecha y Hora': attempt.created_at,
      'Nombre del Curso': attempt.course_name,
      'Código del Curso': attempt.course_code,
      'Cant. de Requerimientos': attempt.totalreq,
      'Cant. de Movimientos Realizados': attempt.movements,
      Tiempo: attempt.time,
      Puntaje: attempt.score,
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(attempts);
    XLSX.utils.book_append_sheet(workbook, worksheet, `Historial de Intentos`);

    const wscols = [
      { wch: 15 }, // 'Id del Intento'
      { wch: 20 }, // 'Fecha y Hora'
      { wch: 30 }, // 'Nombre del Curso'
      { wch: 20 }, // 'Código del Curso'
      { wch: 25 }, // 'Cant. de Requerimientos'
      { wch: 30 }, // 'Cant. de Movimientos Realizados'
      { wch: 10 }, // Tiempo
      { wch: 10 }, // Puntaje
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(
      workbook,
      `${this.studentName()} - Historial de Intentos.xlsx`
    );
  }
}
