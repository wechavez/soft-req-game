import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CreateRoomDto, Room, CourseMetrics, Requirement } from '@types';
import { delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  constructor() {}

  getRooms() {
    const url = `${this.apiUrl}/rooms`;
    return this.http.get<Room[]>(url).pipe(delay(1000));
  }

  createRoom(room: CreateRoomDto) {
    const url = `${this.apiUrl}/rooms`;
    return this.http.post<Room>(url, room);
  }

  removeRoom(roomId: string) {
    const url = `${this.apiUrl}/rooms/remove`;
    return this.http.post(url, { room_id: roomId }).pipe(delay(1000));
  }

  getCourseMetrics(courseId: string): Observable<CourseMetrics> {
    const url = `${this.apiUrl}/admin/course-stats`;
    return this.http.post<CourseMetrics>(url, { course_id: courseId });
  }

  getGeneratedRequirements(courseId: string): Observable<Requirement[]> {
    const url = `${this.apiUrl}/admin/course-content`;
    return this.http.post<Requirement[]>(url, { course_id: courseId });
  }
}
