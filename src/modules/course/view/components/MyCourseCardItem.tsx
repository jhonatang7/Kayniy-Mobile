import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import type { MyCourse } from '../../main/types/my-course.types';

const levelLabels: Record<string, string> = {
  Basic: 'Básico',
  Intermediate: 'Intermedio',
  Advanced: 'Avanzado',
  Medium: 'Medio',
  Hard: 'Difícil',
};

const pastelColors = [
  { card: '#E8EEFF', accent: '#1039B8', progress: '#5478E8' },
  { card: '#E8F7F1', accent: '#177E63', progress: '#43B995' },
  { card: '#FFF2DE', accent: '#A86416', progress: '#E4A44E' },
  { card: '#F6EAFE', accent: '#7A3E9D', progress: '#B36ED5' },
];

export function MyCourseCardItem({
  course,
  index,
}: {
  course: MyCourse;
  index: number;
}) {
  const colors = pastelColors[index % pastelColors.length];
  const progress = Math.min(Math.max(course.totalProgress, 0), 100);

  return (
    <Link
      href={{
        pathname: '/search/[courseId]',
        params: { courseId: course.id },
      }}
      asChild
    >
      <Pressable
        accessibilityRole="button"
        className="mb-4 rounded-3xl p-5 shadow-sm"
        style={{ backgroundColor: colors.card }}
      >
        <View className="flex-row">
          <View className="flex-1 pr-3">
            <Text className="text-xs font-medium text-slate-500">Realizado por:</Text>
            <Text className="mt-1 text-sm font-semibold text-slate-700" numberOfLines={1}>
              {course.communityName}
            </Text>
            <Text className="mt-4 text-xl font-bold text-slate-900" numberOfLines={2}>
              {course.name}
            </Text>
            <Text
              className="mt-3 self-start rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}
            >
              {levelLabels[course.level] ?? course.level}
            </Text>
          </View>
          <View className="items-center justify-start">
            <View
              className="h-11 w-11 items-center justify-center rounded-full bg-white/80"
              accessibilityLabel={course.isCompleted ? 'Curso completado' : 'Curso en progreso'}
            >
              <Ionicons
                name={course.isCompleted ? 'trophy' : 'play-circle-outline'}
                size={23}
                color={course.isCompleted ? '#198754' : colors.accent}
              />
            </View>
            <Text
              className="mt-2 text-center text-xs font-semibold"
              style={{ color: course.isCompleted ? '#198754' : colors.accent }}
            >
              {course.isCompleted ? 'Completado' : 'En progreso'}
            </Text>
          </View>
        </View>

        <View className="mt-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-medium text-slate-600">Progreso</Text>
            <Text className="text-xs font-bold" style={{ color: colors.accent }}>
              {progress}%
            </Text>
          </View>
          <View className="mt-2 h-2 overflow-hidden rounded-full bg-white/80">
            <View
              className="h-full rounded-full"
              style={{ backgroundColor: colors.progress, width: `${progress}%` }}
            />
          </View>
        </View>

        <View className="mt-5 flex-row border-t border-black/5 pt-4">
          <Text className="flex-1 text-xs text-slate-600">
            {course.completedLessons}/{course.totalLessons} lecciones
          </Text>
          <Text className="text-xs text-slate-600">
            {course.completedExams}/{course.totalExams} exámenes
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
