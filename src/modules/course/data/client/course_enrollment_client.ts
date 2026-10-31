import apiClient from '@/src/modules/@core/data/api_client';
import { API_ENDPOINTS } from '@/src/modules/@core/data/endpoints';
import type { EnrollInCourseRequest } from '../../main/types/course-enrollment.types';
import type { MyCourse } from '../../main/types/my-course.types';

export const CourseEnrollmentClient = {
  async enroll(data: EnrollInCourseRequest) {
    const response = await apiClient.post(
      API_ENDPOINTS.COURSE_ENROLLMENTS,
      data
    );
    return response.data;
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
};
