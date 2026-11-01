export interface EnrollInCourseRequest {
  userId: string;
  courseId: string;
}

export interface CompleteCourseEnrollmentRequest {
  courseEnrollmentId: string;
}
