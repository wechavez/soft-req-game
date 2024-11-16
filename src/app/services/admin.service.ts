import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CreateRoomDto, Room } from '@types';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  constructor() {}

  getRooms() {
    const url = `${this.apiUrl}/rooms`;
    return this.http.get<Room[]>(url);
  }

  createRoom(room: CreateRoomDto) {
    const url = `${this.apiUrl}/rooms`;
    return this.http.post<Room>(url, room);
  }
}
