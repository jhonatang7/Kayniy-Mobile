import apiClient from '@/src/modules/@core/data/api_client';
import { API_ENDPOINTS } from '@/src/modules/@core/data/endpoints';
import type { Course, CourseDetail } from '../../main/types/course.types';

export const CourseClient = {
  async getAllCoursesInfo() {
    const response = await apiClient.get<Course[]>(`${API_ENDPOINTS.COURSE}/summary`);
    return response.data;
  },

  async getCourseInfo(id: string) {
    const response = await apiClient.get<CourseDetail>(
      `${API_ENDPOINTS.COURSE}/${id}/details`
    );
    return response.data;
  },
};
