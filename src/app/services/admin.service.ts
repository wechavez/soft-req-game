import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import {
  CreateCourseDto,
  Course,
  CourseMetrics,
  Requirement,
  EditCourseDto,
  RemoveRequirementDto,
  User,
  RequirementAttemptResult,
} from '@types';
import { delay, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl;
  private templateUrl = environment.templateUrl;
  private http = inject(HttpClient);

  constructor() {}

  private _adminCourses = signal<Course[] | null>(null);

  public get adminCourses() {
    return this._adminCourses.asReadonly();
  }

  getCourses() {
    const url = `${this.apiUrl}/courses`;
    return this.http.get<Course[]>(url).pipe(
      delay(1000),
      tap((courses) => this._adminCourses.set(courses))
    );
  }

  createCourse(course: CreateCourseDto) {
    const url = `${this.apiUrl}/courses`;
    return this.http.post<Course>(url, course);
  }

  editCourse(courseId: number, course: EditCourseDto) {
    const url = `${this.apiUrl}/courses/${courseId}`;
    return this.http.put(url, course).pipe(delay(1000));
  }

  removeCourse(courseId: number) {
    const url = `${this.apiUrl}/courses/${courseId}`;
    return this.http.delete(url).pipe(delay(1000));
  }

  getCourseMetrics(courseId: number): Observable<CourseMetrics> {
    const url = `${this.apiUrl}/admin/course-stats/${courseId}`;
    return this.http.get<CourseMetrics>(url).pipe(delay(1000));
  }

  getGeneratedRequirements(courseId: number): Observable<Requirement[]> {
    const url = `${this.apiUrl}/admin/course-content/${courseId}`;
    return this.http.get<Requirement[]>(url).pipe(delay(1000));
  }

  removeRequirement({ courseId, requirementId }: RemoveRequirementDto) {
    const url = `${this.apiUrl}/admin/course-content/${courseId}/${requirementId}`;
    return this.http.delete(url).pipe(delay(1000));
  }

  checkIfThereIsAnyAttemptInCourse(courseId: number): Observable<boolean> {
    const url = `${this.apiUrl}/courses/exists-attempts/${courseId}`;
    return this.http.get<{ hasAttempts: boolean }>(url).pipe(
      map((res) => res.hasAttempts),
      delay(1000)
    );
  }

  updateRequirement(requirement: Requirement) {
    const url = `${this.apiUrl}/admin/requirements/${requirement.id}`;
    return this.http.put(url, requirement).pipe(delay(1000));
  }

  getStudentsByCourseId(courseId: number): Observable<User[]> {
    const url = `${this.apiUrl}/admin/students/${courseId}`;
    return this.http.get<User[]>(url).pipe(delay(1000));
  }

  getStudentById(studentId: number): Observable<User> {
    const url = `${this.apiUrl}/admin/student/${studentId}`;
    return this.http.get<User>(url).pipe(delay(1000));
  }

  getAttemptResults(attemptId: number): Observable<RequirementAttemptResult[]> {
    const url = `${this.apiUrl}/admin/attempt-result/${attemptId}`;
    return this.http.get<RequirementAttemptResult[]>(url).pipe(delay(1000));
  }

  downloadTemplate() {
    window.open(this.templateUrl, '_blank');
  }

  cleanData() {
    this._adminCourses.set(null);
  }
}
