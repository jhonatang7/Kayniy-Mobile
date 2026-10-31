import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CourseClient } from '../client/course_client';
import { CourseEnrollmentClient } from '../client/course_enrollment_client';
import type { EnrollInCourseRequest } from '../../main/types/course-enrollment.types';

export const courseKeys = {
  all: ['courses'] as const,
  info: () => [...courseKeys.all, 'info'] as const,
  detail: (id: string) => [...courseKeys.info(), id] as const,
};

export const useAllCoursesInfo = () =>
  useQuery({
    queryKey: courseKeys.info(),
    queryFn: CourseClient.getAllCoursesInfo,
  });

export const useCourseInfo = (id: string) =>
  useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => CourseClient.getCourseInfo(id),
    enabled: Boolean(id),
  });

export const courseEnrollmentKeys = {
  all: ['course-enrollments'] as const,
  check: (userId: string, courseId: string) =>
    [...courseEnrollmentKeys.all, 'check', userId, courseId] as const,
  myCourses: (userId: string) =>
    [...courseEnrollmentKeys.all, 'my-courses', userId] as const,
};

export const useIsUserEnrolled = (
  userId: string | undefined,
  courseId: string
) =>
  useQuery({
    queryKey: courseEnrollmentKeys.check(userId ?? '', courseId),
    queryFn: () => {
      if (!userId) {
        throw new Error('No se puede verificar la inscripción sin un usuario autenticado.');
      }
      return CourseEnrollmentClient.isUserEnrolled(userId, courseId);
    },
    enabled: Boolean(userId && courseId),
  });

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EnrollInCourseRequest) =>
      CourseEnrollmentClient.enroll(data),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        courseEnrollmentKeys.check(variables.userId, variables.courseId),
        true
      );
    },
  });
};

export const useMyCourses = (userId: string | undefined) =>
  useQuery({
    queryKey: courseEnrollmentKeys.myCourses(userId ?? ''),
    queryFn: () => {
      if (!userId) {
        throw new Error('No se pueden cargar los cursos sin un usuario autenticado.');
      }
      return CourseEnrollmentClient.getMyCourses(userId);
    },
    enabled: Boolean(userId),
  });
