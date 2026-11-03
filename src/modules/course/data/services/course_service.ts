import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  CompleteCourseEnrollmentRequest,
  EnrollInCourseRequest,
} from '../../main/types/course-enrollment.types';
import type { ReviewQuizDto } from '../../main/types/quiz.types';
import type {
  CompleteModuleProgressRequest,
  RegisterLessonProgressRequest,
} from '../../main/types/user-progress.types';
import { CourseClient } from '../client/course_client';
import { CourseEnrollmentClient } from '../client/course_enrollment_client';
import { UserModuleProgressClient } from '../client/user_module_progress_client';
import { UserProgressClient } from '../client/user_progress_client';

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

export const useRandomCourses = () =>
  useQuery({
    queryKey: [...courseKeys.all, 'random'],
    queryFn: CourseClient.getRandomCourses,
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
  myCoursesPrefix: () =>
    [...courseEnrollmentKeys.all, 'my-courses'] as const,
  content: (courseId: string) =>
    [...courseEnrollmentKeys.all, 'content', courseId] as const,
  lessonContent: (lessonId: string) =>
    [...courseEnrollmentKeys.all, 'lesson-content', lessonId] as const,
  quizContent: (quizId: string) =>
    [...courseEnrollmentKeys.all, 'quiz-content', quizId] as const,
  latestQuizAttempt: (quizId: string, courseEnrollmentId: string) =>
    [...courseEnrollmentKeys.all, 'latest-quiz-attempt', quizId, courseEnrollmentId] as const,
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
    onSuccess: async (_, variables) => {
      queryClient.setQueryData(
        courseEnrollmentKeys.check(variables.userId, variables.courseId),
        true
      );
      await queryClient.invalidateQueries({
        queryKey: courseEnrollmentKeys.myCourses(variables.userId),
        refetchType: 'all',
      });
    },
  });
};

export const useCompleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompleteCourseEnrollmentRequest) =>
      CourseEnrollmentClient.completeCourse(data),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: courseEnrollmentKeys.content(variables.courseEnrollmentId),
      });
      await queryClient.invalidateQueries({
        queryKey: courseEnrollmentKeys.myCoursesPrefix(),
        refetchType: 'all',
      });
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

export const useCourseContent = (courseId: string) =>
  useQuery({
    queryKey: courseEnrollmentKeys.content(courseId),
    queryFn: () => CourseEnrollmentClient.getContent(courseId),
    enabled: Boolean(courseId),
  });

export const useLessonContent = (lessonId: string) =>
  useQuery({
    queryKey: courseEnrollmentKeys.lessonContent(lessonId),
    queryFn: () => CourseEnrollmentClient.getLessonContent(lessonId),
    enabled: Boolean(lessonId),
  });

export const useQuizContent = (quizId: string) =>
  useQuery({
    queryKey: courseEnrollmentKeys.quizContent(quizId),
    queryFn: () => CourseEnrollmentClient.getQuizContent(quizId),
    enabled: Boolean(quizId),
  });

export const useLatestQuizAttempt = (quizId: string, courseEnrollmentId: string) =>
  useQuery({
    queryKey: courseEnrollmentKeys.latestQuizAttempt(quizId, courseEnrollmentId),
    queryFn: () => CourseEnrollmentClient.getLatestQuizAttempt(quizId, courseEnrollmentId),
    enabled: Boolean(quizId && courseEnrollmentId),
  });

export const useReviewQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReviewQuizDto) => CourseEnrollmentClient.reviewQuiz(data),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: courseEnrollmentKeys.content(variables.courseEnrollmentId),
      });
      await queryClient.invalidateQueries({
        queryKey: courseEnrollmentKeys.myCoursesPrefix(),
        refetchType: 'all',
      });
      await queryClient.invalidateQueries({
        queryKey: courseEnrollmentKeys.latestQuizAttempt(
          variables.quizId,
          variables.courseEnrollmentId
        ),
      });
    },
  });
};

export const useRegisterLessonProgress = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterLessonProgressRequest) =>
      UserProgressClient.registerLesson(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: courseEnrollmentKeys.content(courseId),
      });
      await queryClient.invalidateQueries({
        queryKey: courseEnrollmentKeys.myCoursesPrefix(),
        refetchType: 'all',
      });
    },
  });
};

export const useCompleteModuleProgress = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompleteModuleProgressRequest) =>
      UserModuleProgressClient.completeModule(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: courseEnrollmentKeys.content(courseId),
      });
      await queryClient.invalidateQueries({
        queryKey: courseEnrollmentKeys.myCoursesPrefix(),
        refetchType: 'all',
      });
    },
  });
};
