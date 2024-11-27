export interface Room {
  id: number;
  room_name: string;
  room_code: string;
  user_id: number;
  created_at: string;
  max_attempts: number;
  items_per_attempt: number;
}
export interface CreateRoomDto
  extends Omit<Room, 'id' | 'created_at' | 'user_id'> {
  language: string;
  additional_context: string;
}

export interface EnrolledCourse {
  id: number;
  room_name: string;
  room_code: string;
  created_at: Date;
  max_attempts: number;
  teacher_id: number;
  teacher_email: string;
  teacher_name: string;
}

export type AttemptStatus = 'completed' | 'abandoned';

export interface UpdateAttemptStatusAndStatsDto {
  attemptId: number;
  status: AttemptStatus;
  score: number;
  movements: number;
  time: string;
}

export interface AttemptRecord {
  id: number;
  user_id: number;
  room_id: number;
  totalreq: number;
  movements: number;
  score: number;
  status: string;
  time: string;
  created_at: Date;
  room_name: string;
  room_code: string;
  max_attempts: number;
}
