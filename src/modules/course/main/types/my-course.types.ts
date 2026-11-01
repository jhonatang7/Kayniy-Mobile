export interface MyCourse {
  id: string;
  enrollment_course_id: string;
  name: string;
  description: string;
  level: 'Basic' | 'Intermediate' | 'Advanced' | string;
  communityName: string;
  enrollmentDate: string;
  isCompleted: boolean;
  totalProgress: number;
  totalModules: number;
  totalLessons: number;
  completedLessons: number;
  totalExams: number;
  completedExams: number;
  firstLessonId: string;
}
