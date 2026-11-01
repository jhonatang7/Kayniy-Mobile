export interface Option {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  type: 'UNIQUE_SELECTION' | 'MULTIPLE_SELECTION' | string;
  order: number;
  points: number;
  options: Option[];
}

export interface Evaluation {
  id: string;
  name: string;
  description: string;
  passingScore: number;
  registeredDate: string;
  questions: Question[];
}

export interface ReviewQuizQuestionDto {
  questionId: string;
  answers: string[];
}

export interface ReviewQuizDto {
  quizId: string;
  courseEnrollmentId: string;
  questions: ReviewQuizQuestionDto[];
}

export interface ReviewQuizResponse {
  lessonId: string;
}

export interface LatestQuizAttempt {
  id: string;
  scoreGotten: number;
  aprobed: boolean;
  attemptDate: string;
}
