import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

import { Input } from '@/src/modules/@core/view/components';
import { AuthScreen } from '@/src/modules/auth/view/components/AuthScreen';
import {
  CourseCardItemList,
  CourseFilterModal,
} from '@/src/modules/course/view/components';
import { useAllCoursesInfo } from '@/src/modules/course/data/services/course_service';

type SortDirection = 'asc' | 'desc';
type LevelFilter = 'all' | string;

const levelOptions = [
  { value: 'all', label: 'Todas las dificultades' },
  { value: 'Basic', label: 'Básico' },
  { value: 'Medium', label: 'Medio' },
  { value: 'Hard', label: 'Difícil' },
];
const sortOptions = [
  { value: 'desc', label: 'Más recientes primero' },
  { value: 'asc', label: 'Más antiguas primero' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<LevelFilter>('all');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [activeFilter, setActiveFilter] = useState<'level' | 'sort' | null>(null);
  const { data: courses, isLoading, isError, refetch } = useAllCoursesInfo();

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...(courses ?? [])]
      .filter((course) => {
        const searchableText = [
          course.name,
          course.description,
          course.communityName,
          course.community?.name,
          course.acronym,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return (
          (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
          (level === 'all' || course.level === level)
        );
      })
      .sort((a, b) => {
        const first = new Date(a.registeredDate).getTime();
        const second = new Date(b.registeredDate).getTime();
        return sortDirection === 'asc' ? first - second : second - first;
      });
  }, [courses, level, query, sortDirection]);

  const selectedLevelLabel =
    levelOptions.find((option) => option.value === level)?.label ?? 'Dificultad';
  const selectedSortLabel =
    sortOptions.find((option) => option.value === sortDirection)?.label ?? 'Ordenar por fecha';

  return (
    <AuthScreen scrollable={false}>
      <View className="flex-1 bg-slate-50 px-6 pt-10">
      <Text className="text-3xl font-bold text-slate-900">Buscar cursos</Text>
      <Text className="mt-2 text-base text-slate-500">
        Encuentra el curso que quieres aprender.
      </Text>
      <Input
        label="Buscar"
        placeholder="Nombre, comunidad o acrónimo"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        returnKeyType="search"
        containerClassName="mt-6"
      />
      <View className="mb-5 mt-1 flex-row gap-3">
        <Pressable
          className="flex-1 flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
          onPress={() => setActiveFilter('level')}
        >
          <Text className="flex-1 text-sm text-slate-700" numberOfLines={1}>
            {selectedLevelLabel}
          </Text>
          <Text className="ml-2 text-slate-500">⌄</Text>
        </Pressable>
        <Pressable
          className="flex-1 flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
          onPress={() => setActiveFilter('sort')}
        >
          <Text className="flex-1 text-sm text-slate-700" numberOfLines={1}>
            {selectedSortLabel}
          </Text>
          <Text className="ml-2 text-slate-500">⌄</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1039B8" />
        </View>
      ) : isError ? (
        <View className="items-center rounded-2xl bg-white p-6">
          <Text className="text-center text-base text-red-600">
            No fue posible cargar los cursos.
          </Text>
          <Pressable className="mt-4" onPress={() => void refetch()}>
            <Text className="font-semibold text-[#1039B8]">Intentar nuevamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(course) => course.id}
          renderItem={({ item }) => <CourseCardItemList course={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="items-center rounded-2xl bg-white p-6">
              <Text className="text-center text-base text-slate-500">
                {query.trim() || level !== 'all'
                  ? 'No encontramos cursos con esos filtros.'
                  : 'Aún no hay cursos disponibles.'}
              </Text>
            </View>
          }
        />
      )}

      <CourseFilterModal
        visible={activeFilter === 'level'}
        title="Filtrar por dificultad"
        options={levelOptions}
        selected={level}
        onSelect={setLevel}
        onClose={() => setActiveFilter(null)}
      />
      <CourseFilterModal
        visible={activeFilter === 'sort'}
        title="Ordenar por fecha de registro"
        options={sortOptions}
        selected={sortDirection}
        onSelect={(value) => setSortDirection(value as SortDirection)}
        onClose={() => setActiveFilter(null)}
      />
      </View>
    </AuthScreen>
  );
}
