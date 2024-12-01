import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CreateCourseDto, Course, CourseMetrics, Requirement } from '@types';
import { delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  constructor() {}

  getCourses() {
    const url = `${this.apiUrl}/courses`;
    return this.http.get<Course[]>(url).pipe(delay(1000));
  }

  createCourse(course: CreateCourseDto) {
    const url = `${this.apiUrl}/courses`;
    return this.http.post<Course>(url, course);
  }

  removeCourse(courseId: string) {
    const url = `${this.apiUrl}/courses/${courseId}`;
    return this.http.delete(url).pipe(delay(1000));
  }

  getCourseMetrics(courseId: number): Observable<CourseMetrics> {
    const url = `${this.apiUrl}/admin/course-stats/${courseId}`;
    return this.http.get<CourseMetrics>(url);
  }

  getGeneratedRequirements(courseId: number): Observable<Requirement[]> {
    const url = `${this.apiUrl}/admin/course-content/${courseId}`;
    return this.http.get<Requirement[]>(url);
  }
}
