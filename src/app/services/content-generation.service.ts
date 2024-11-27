import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Requirement } from '@types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentGenerationService {
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  constructor() {}

  getRequirements(roomCode: string): Observable<Requirement[]> {
    const url = `${this.apiUrl}/game/content`;

    return this.http.post<Requirement[]>(url, { roomCode });
  }
}
