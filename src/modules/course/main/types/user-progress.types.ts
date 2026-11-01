export interface RegisterLessonProgressRequest {
  lessonId: string;
  courseEnrollmentId: string;
}

export interface CompleteModuleProgressRequest {
  moduleId: string;
  courseEnrollmentId: string;
}
