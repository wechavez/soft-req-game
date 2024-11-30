import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import {
  AttemptRecord,
  EnrolledCourse,
  Room,
  UpdateAttemptStatusAndStatsDto,
} from '@types';
import { delay, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = environment.apiUrl;

  enrolledCourses = signal<EnrolledCourse[] | null>(null);

  currentGameAttempt = signal<{
    id?: string;
    roomCode?: string;
    remaining?: number;
  } | null>(null);

  private http = inject(HttpClient);

  constructor() {}

  getEnrolledCourses() {
    const url = `${this.apiUrl}/rooms/enrolled`;
    return this.http.get<EnrolledCourse[]>(url).pipe(
      delay(1000),
      tap((courses) => {
        this.enrolledCourses.set(courses);
      })
    );
  }

  enrollInCourse(roomCode: string) {
    const url = `${this.apiUrl}/rooms/enroll`;
    return this.http.post(url, { room_code: roomCode }).pipe(delay(1000));
  }

  checkAttemptsRemaining(
    courseId: number
  ): Observable<{ remaining: number; max_attempts: number }> {
    const url = `${this.apiUrl}/attempts/${courseId}`;
    return this.http.get<{ remaining: number; max_attempts: number }>(url).pipe(
      delay(1000),
      tap(({ remaining }) => {
        this.currentGameAttempt.update((current) => ({
          ...current,
          remaining,
        }));
      })
    );
  }

  registerAttempt(
    roomCode: string,
    totalRequirements: number
  ): Observable<{ id: string }> {
    const url = `${this.apiUrl}/attempts`;
    return this.http
      .post<{ id: string }>(url, {
        room_code: roomCode,
        totalreq: totalRequirements,
      })
      .pipe(
        delay(1000),
        tap(({ id }) => {
          this.currentGameAttempt.update((current) => ({
            ...current,
            id,
          }));
        })
      );
  }

  resetCurrentGameAttempt() {
    this.currentGameAttempt.set(null);
  }

  updateAttemptStatusAndStats(dto: UpdateAttemptStatusAndStatsDto) {
    const url = `${this.apiUrl}/attempts`;
    return this.http.put(url, dto).pipe(delay(1000));
  }

  getAttemptsHistory() {
    const url = `${this.apiUrl}/student/history`;
    return this.http.get<AttemptRecord[]>(url).pipe(delay(1000));
  }
}
