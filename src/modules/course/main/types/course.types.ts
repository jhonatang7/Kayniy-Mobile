export interface Community {
  id: string;
  name: string;
  description: string;
  registeredDate: string;
  deletedAt: string | null;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  level: 'Basic' | 'Intermediate' | 'Advanced' | string;
  registeredDate: string;
  isDeleted: boolean;
  community: Community;
  communityName: string;
  acronym: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  urlContent: string;
  duration: number;
  order: number;
  type: 'VIDEO' | 'DOCUMENT' | string;
}

export interface Quiz {
  id: string;
  name: string;
  description: string;
  passingScore: number;
  registeredDate: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  state: 'VERIFIED' | 'PENDING' | string;
  registeredDate: string;
  lessons: Lesson[];
  quiz: Quiz;
}

export interface CourseModule {
  id: string;
  order: number;
  module: Module;
}

export interface FlattenedModule {
  id: string;
  title: string;
  description: string;
  state: 'VERIFIED' | string;
  registeredDate: string;
  order: number;
  lessons: Lesson[];
  exam: string;
}

export interface CourseDetail {
  id: string;
  name: string;
  description: string;
  level: 'Basic' | 'Intermediate' | 'Advanced' | string;
  registeredDate: string;
  isDeleted: boolean;
  community: Community;
  courseModules: CourseModule[];
  communityName: string;
  modules: FlattenedModule[];
  totalModules: number;
  totalLessons: number;
}
