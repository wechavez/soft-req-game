import { Requirement, RequirementAttempt } from './content.type';

export interface Course {
  id: number;
  course_name: string;
  course_code: string;
  user_id: number;
  created_at: string;
  max_attempts: number;
  items_per_attempt: number;
}
export interface CreateCourseDto
  extends Omit<Course, 'id' | 'created_at' | 'user_id'> {
  language: string;
  additional_context: string;
  content_mode: 'generated' | 'file_upload';
  requirements?: CreateRequirementDto[];
}

export interface EditCourseDto {
  course_name: string;
  max_attempts: number;
  items_per_attempt: number;
}

export interface CreateRequirementDto {
  text: string;
  isValid: boolean;
  feedback: string;
}

export interface RemoveRequirementDto {
  courseId: number;
  requirementId: number;
}

export interface EnrolledCourse {
  id: number;
  course_name: string;
  course_code: string;
  created_at: Date;
  max_attempts: number;
  teacher_id: number;
  teacher_email: string;
  teacher_name: string;
}

export type AttemptStatus = 'completed' | 'abandoned';

export interface RegisterAttemptDto {
  courseId: number;
  totalRequirements: number;
  requirements: RequirementAttempt[];
}

export interface UpdateAttemptStatusAndStatsDto {
  attemptId: number;
  status: AttemptStatus;
  score: number;
  movements: number;
  time: string;
  requirements: RequirementAttempt[];
}

export interface AttemptRecord {
  id: number;
  user_id: number;
  course_id: number;
  totalreq: number;
  movements: number;
  score: number;
  status: string;
  time: string;
  created_at: Date;
  course_name: string;
  course_code: string;
  max_attempts: number;
}
