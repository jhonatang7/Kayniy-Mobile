import type { ContentType } from './course-content.types';

export interface LessonContentResponse {
	id: string;
	title: string;
	description: string;
	urlContent: string;
	duration: number | null;
	order: number;
	type: ContentType;
}