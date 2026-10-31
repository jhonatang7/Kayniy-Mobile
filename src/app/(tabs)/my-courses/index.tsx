import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

import { Input } from '@/src/modules/@core/view/components';
import { AuthService } from '@/src/modules/auth/data/services/auth_service';
import { AuthScreen } from '@/src/modules/auth/view/components/AuthScreen';
import { useMyCourses } from '@/src/modules/course/data/services/course_service';
import { MyCourseCardItem } from '@/src/modules/course/view/components';

export default function MyCoursesScreen() {
  const [query, setQuery] = useState('');
  const { data: user } = AuthService.useMe();
  const { data: courses, isLoading, isError, refetch } = useMyCourses(user?.id);

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return (courses ?? []).filter((course) =>
      `${course.name} ${course.communityName} ${course.description}`
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [courses, query]);

  return (
    <AuthScreen scrollable={false}>
      <View className="flex-1 bg-slate-50 px-6 pt-10">
        <Text className="text-3xl font-bold text-slate-900">Mis cursos</Text>
        <Text className="mt-2 text-base text-slate-500">
          Continúa aprendiendo donde lo dejaste.
        </Text>
        <Input
          label="Buscar en mis cursos"
          placeholder="Nombre o comunidad"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
          containerClassName="mt-6"
        />

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#1039B8" />
          </View>
        ) : isError ? (
          <View className="items-center rounded-2xl bg-white p-6">
            <Text className="text-center text-base text-red-600">
              No fue posible cargar tus cursos.
            </Text>
            <Pressable className="mt-4" onPress={() => void refetch()}>
              <Text className="font-semibold text-[#1039B8]">Intentar nuevamente</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={filteredCourses}
            keyExtractor={(course) => course.id}
            renderItem={({ item, index }) => (
              <MyCourseCardItem course={item} index={index} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}
            ListEmptyComponent={
              <View className="items-center rounded-2xl bg-white p-6">
                <Text className="text-center text-base text-slate-500">
                  {query.trim()
                    ? 'No encontramos cursos con esa búsqueda.'
                    : 'Todavía no tienes cursos registrados.'}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </AuthScreen>
  );
}
