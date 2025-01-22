import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonPageHeaderSkeletonComponent } from '@components';
import { AdminService } from '@services';
import { User } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [PrimeNgModule, FormsModule, CommonPageHeaderSkeletonComponent],
  templateUrl: './student-list.component.html',
  styles: ``,
})
export class StudentListComponent implements OnInit {
  private router = inject(Router);
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  courseId = signal<number | null>(null);
  course = computed(() =>
    this.adminService.adminCourses()?.find((c) => c.id === this.courseId())
  );

  loadingStudents = signal(true);
  loadingCourses = signal(false);

  students = signal<User[]>([]);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.courseId.set(+params['courseId']);
    });

    if (!this.courseId()) {
      this.router.navigate(['/courses']);
      return;
    }

    if (!this.adminService.adminCourses()) {
      this.getCourses();
    }

    this.getStudents();
  }

  getCourses() {
    this.loadingCourses.set(true);
    this.adminService.getCourses().subscribe(() => {
      this.loadingCourses.set(false);
    });
  }

  getStudents() {
    this.loadingStudents.set(true);
    this.adminService
      .getStudentsByCourseId(this.courseId()!)
      .subscribe((students) => {
        this.students.set(students);
        this.loadingStudents.set(false);
      });
  }

  navigateToAdminHome() {
    this.router.navigate(['admin']);
  }

  downloadStudentsList() {
    const formattedStudents = this.students().map((student) => ({
      'Id del Estudiante': student.id,
      'Nombre del Estudiante': student.first_name + ' ' + student.last_name,
      'Email del Estudiante': student.email,
      Curso: this.course()?.course_code,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Estudiantes ${this.course()?.course_code}`
    );

    const wscols = [
      { wch: 15 }, // 'Id del Estudiante'
      { wch: 20 }, // 'Nombre del Estudiante'
      { wch: 20 }, // 'Email del Estudiante'
      { wch: 15 }, // 'Curso'
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(
      workbook,
      `${this.course()?.course_code} - Estudiantes.xlsx`
    );

    this.messageService.add({
      severity: 'success',
      summary: 'Descargado',
      detail: 'Archivo descargado correctamente',
    });
  }

  navigateToStudentHistory(studentId: number) {
    this.router.navigate([
      'admin',
      'student-history',
      this.courseId()!,
      studentId,
    ]);
  }
}
