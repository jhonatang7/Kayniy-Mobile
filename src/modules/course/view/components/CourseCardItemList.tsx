import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import type { Course } from '../../main/types/course.types';

const levelOptions = [
  { value: 'all', label: 'Todas las dificultades' },
  { value: 'Basic', label: 'Básico' },
  { value: 'Medium', label: 'Medio' },
  { value: 'Hard', label: 'Difícil' },
];

export function CourseCardItemList({ course }: { course: Course }) {
  const communityName = course.communityName || course.community?.name || 'Comunidad no especificada';

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
        className="mb-3 flex-row rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
      >
        <View className="h-16 w-16 items-center justify-center rounded-xl bg-[#E8EEFF]">
          <Text className="text-center text-lg font-bold text-[#1039B8]">
            {course.acronym || course.name.slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View className="ml-4 flex-1 justify-center">
          <Text className="text-base font-bold text-slate-900" numberOfLines={2}>
            {course.name}
          </Text>
          <Text className="mt-1 text-xs text-slate-400">Realizado por:</Text>
          <Text className="text-sm text-slate-500" numberOfLines={1}>
            {communityName}
          </Text>
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {levelOptions.find((option) => option.value === course.level)?.label || 'Dificultad desconocida'}
            </Text>
          </View>
        </View>
        <View className="ml-4 flex items-center justify-center">
          <Ionicons name="arrow-forward" size={20} color="#1039B8" />
        </View>
      </Pressable>
    </Link>
  );
}
