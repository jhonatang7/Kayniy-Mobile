import apiClient from '@/src/modules/@core/data/api_client';
import { API_ENDPOINTS } from '@/src/modules/@core/data/endpoints';
import type {
  CourseDetailResponse,
} from '../../main/types/course-content.types';
import type {
  CompleteCourseEnrollmentRequest,
  EnrollInCourseRequest,
} from '../../main/types/course-enrollment.types';
import type { LessonContentResponse } from '../../main/types/lesson-content.types';
import type { MyCourse } from '../../main/types/my-course.types';
import type {
  Evaluation,
  LatestQuizAttempt,
  ReviewQuizDto,
  ReviewQuizResponse,
} from '../../main/types/quiz.types';

export const CourseEnrollmentClient = {
  async enroll(data: EnrollInCourseRequest) {
    const response = await apiClient.post(
      API_ENDPOINTS.COURSE_ENROLLMENTS,
      data
    );
    return response.data;
  },

  async completeCourse(data: CompleteCourseEnrollmentRequest) {
    await apiClient.post(
      `${API_ENDPOINTS.COURSE_ENROLLMENTS}/complete`,
      data
    );
  },

  async isUserEnrolled(userId: string, courseId: string) {
    const response = await apiClient.get<boolean>(
      `${API_ENDPOINTS.COURSE_ENROLLMENTS}/check/${userId}/${courseId}`
    );
    return response.data;
  },

  async getMyCourses(userId: string) {
    const response = await apiClient.get<MyCourse[]>(
      `${API_ENDPOINTS.COURSE_ENROLLMENTS}/my-courses/${userId}`
    );
    return response.data;
  },

  async getContent(courseId: string) {
    const response = await apiClient.get<CourseDetailResponse>(
      `${API_ENDPOINTS.COURSE_ENROLLMENTS}/${courseId}/content`
    );
    return response.data;
  },

  async getLessonContent(lessonId: string) {
    const response = await apiClient.get<LessonContentResponse>(
      `${API_ENDPOINTS.LESSONS}/${lessonId}/content`
    );
    return response.data;
  },

  async getQuizContent(quizId: string) {
    const response = await apiClient.get<Evaluation>(
      `${API_ENDPOINTS.QUIZZES}/${quizId}/content`
    );
    return response.data;
  },

  async reviewQuiz(data: ReviewQuizDto) {
    const response = await apiClient.post<ReviewQuizResponse>(
      `${API_ENDPOINTS.QUIZZES}/review`,
      data
    );
    return response.data;
  },

  async getLatestQuizAttempt(quizId: string, courseEnrollmentId: string) {
    const response = await apiClient.get<LatestQuizAttempt | null>(
      `${API_ENDPOINTS.USER_QUIZ_ATTEMPTS}/latest`,
      { params: { quizId, courseEnrollmentId } }
    );
    return response.data;
  },
};
