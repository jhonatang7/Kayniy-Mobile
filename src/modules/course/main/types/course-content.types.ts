export type ContentType = 'VIDEO' | 'DOCUMENT' | 'QUIZ';
export type QuizStatus = 'PASSED' | 'FAILED' | 'NOT_STARTED';

export interface Enrollment {
  id: string;
  isCompleted: boolean;
  enrollmentDate: string;
  completedDate: string | null;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  level: string;
}

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  duration: number | null;
  description: string;
  isCompleted: boolean;
  status?: QuizStatus;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  isCompleted: boolean;
  contents: Content[];
}

export interface CourseDetailResponse {
  enrollment: Enrollment;
  course: Course;
  modules: Module[];
}