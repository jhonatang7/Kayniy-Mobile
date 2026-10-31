import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/src/modules/@core/view/components';
import { AuthService } from '@/src/modules/auth/data/services/auth_service';
import { AuthScreen } from '@/src/modules/auth/view/components/AuthScreen';
import {
  CourseEnrollmentModal,
} from '@/src/modules/course/view/components';
import {
  useCourseInfo,
  useEnrollInCourse,
  useIsUserEnrolled,
} from '@/src/modules/course/data/services/course_service';
import type { CourseModule, FlattenedModule } from '@/src/modules/course/main/types/course.types';

const levelLabels: Record<string, string> = {
  Basic: 'Básico',
  Intermediate: 'Intermedio',
  Advanced: 'Avanzado',
  Medium: 'Medio',
  Hard: 'Difícil',
};

function ModuleContent({ item }: { item: FlattenedModule | CourseModule }) {
  const module = 'module' in item ? item.module : item;
  const lessons = module.lessons ?? [];
  const exam = 'exam' in item ? item.exam : item.module.quiz?.name;

  return (
    <View className="border-b border-slate-100 py-4">
      <Text className="text-base font-bold text-slate-900">{module.title}</Text>
      {lessons.map((lesson) => (
        <View key={lesson.id} className="mt-3 flex-row items-center">
          <View className="h-2 w-2 rounded-full bg-[#1039B8]" />
          <Text className="ml-3 flex-1 text-sm text-slate-600">{lesson.title}</Text>
        </View>
      ))}
      {exam ? (
        <View className="mt-3 flex-row items-center">
          <View className="h-2 w-2 rounded-full bg-amber-500" />
          <Text className="ml-3 flex-1 text-sm font-medium text-slate-700">
            Examen: {exam}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center border-b border-slate-100 py-4">
      <Ionicons name={icon} size={22} color="#1039B8" />
      <Text className="ml-3 flex-1 text-sm text-slate-600">{label}</Text>
      <Text className="text-sm font-semibold text-slate-900">{value}</Text>
    </View>
  );
}

export default function CourseDetailScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const id = Array.isArray(courseId) ? courseId[0] : courseId;
  const { data: user, isLoading: isUserLoading } = AuthService.useMe(Boolean(id));
  const { data: course, isLoading, isError, refetch } = useCourseInfo(id);
  const {
    data: isUserEnrolled,
    isLoading: isEnrollmentCheckLoading,
  } = useIsUserEnrolled(user?.id, id);
  const enrollMutation = useEnrollInCourse();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isEnrollmentModalVisible, setIsEnrollmentModalVisible] = useState(false);

  const handleEnrollment = () => {
    if (!user?.id || !id) return;

    enrollMutation.mutate(
      { userId: user.id, courseId: id },
      {
        onSuccess: () => {
          setIsEnrollmentModalVisible(false);
          router.replace('/(tabs)/my-courses');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <AuthScreen scrollable={false}>
        <View className="flex-1 items-center justify-center bg-slate-50">
          <ActivityIndicator size="large" color="#1039B8" />
        </View>
      </AuthScreen>
    );
  }

  if (isError || !course) {
    return (
      <AuthScreen scrollable={false}>
        <View className="flex-1 items-center justify-center bg-slate-50 px-6">
          <Text className="text-center text-base text-red-600">
            No fue posible cargar el detalle del curso.
          </Text>
          <Pressable className="mt-4" onPress={() => void refetch()}>
            <Text className="font-semibold text-[#1039B8]">Intentar nuevamente</Text>
          </Pressable>
        </View>
      </AuthScreen>
    );
  }

  const modules = course.modules?.length ? course.modules : course.courseModules ?? [];
  const totalLessons = modules.reduce((total, item) => {
    const module = 'module' in item ? item.module : item;
    return total + (module.lessons?.length ?? 0);
  }, 0);

  const totalTimeLessons = modules.reduce((totalModulesTime, item) => {
    const module = 'module' in item ? item.module : item;
    const moduleTime = module.lessons?.reduce((totalLessonTime, lesson) => {
      return totalLessonTime + (lesson.duration ?? 0);
    }, 0) ?? 0;
    return totalModulesTime + moduleTime;
  }, 0);

  const formatDuration = (totalMinutes: number): string => {
    if (totalMinutes < 60) {
      return `${totalMinutes} minutos`;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }

    return `${hours} h ${minutes} min`;
  };
  const level = levelLabels[course.level] ?? course.level;
  const communityName = course.communityName || course.community?.name || 'Comunidad no especificada';
  const descriptionIsLong = course.description.trim().length > 220;

  return (
    <AuthScreen scrollable={false}>
      <ScrollView
        className="flex-1 bg-slate-50"
        contentContainerClassName="px-6 pb-10 pt-8"
        showsVerticalScrollIndicator={false}
      >
        <Pressable className="mb-6" onPress={() => router.back()}>
          <Text className="font-semibold text-[#1039B8]">‹ Volver a cursos</Text>
        </Pressable>
        <View className="rounded-3xl bg-[#1039B8] p-6">
          <View className="self-start rounded-full bg-white/20 px-3 py-1">
            <Text className="text-xs font-semibold text-white">{level}</Text>
          </View>
          <Text className="mt-4 text-3xl font-bold text-white">{course.name}</Text>
          <Text className="mt-3 text-sm text-blue-100">Realizado por: {communityName}</Text>
          <View className="mt-4 flex-row items-center self-start rounded-full bg-white/15 px-3 py-2">
            <Ionicons name="layers-outline" size={14} color="#FFFFFF" className='mr-1' />
            <Text className="text-xs font-semibold text-white">
              {modules.length} {modules.length === 1 ? 'módulo' : 'módulos'}
            </Text>
          </View>
        </View>

        <Button
          className="mt-5"
          fullWidth
          disabled={Boolean(
            isUserEnrolled ||
              isUserLoading ||
              isEnrollmentCheckLoading ||
              enrollMutation.isPending
          )}
          onPress={() => setIsEnrollmentModalVisible(true)}
        >
          {isEnrollmentCheckLoading
            ? 'Verificando inscripción...'
            : isUserEnrolled
              ? 'Ya estás inscrito en este curso'
              : 'Empezar curso'}
        </Button>

        <View className="mt-5 rounded-2xl bg-white p-5">
          <Text className="text-lg font-bold text-slate-900">Sobre este curso</Text>
          <Text
            className="mt-3 leading-6 text-slate-600"
            numberOfLines={isDescriptionExpanded ? undefined : 4}
          >
            {course.description}
          </Text>
          {descriptionIsLong ? (
            <Pressable className="mt-2 self-start" onPress={() => setIsDescriptionExpanded((value) => !value)}>
              <Text className="font-semibold text-[#1039B8]">
                {isDescriptionExpanded ? 'Ver menos' : 'Ver más'}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View className="mt-5 rounded-2xl bg-white px-5">
          <Text className="pt-5 text-lg font-bold text-slate-900">Detalles del curso</Text>
          <DetailRow icon="layers-outline" label="Módulos" value={String(course.totalModules ?? modules.length)} />
          <DetailRow
            icon="book-outline"
            label="Lecciones"
            value={`${course.totalLessons ?? totalLessons}`}
          />
          <DetailRow icon="bar-chart-outline" label="Nivel" value={level} />
          <DetailRow icon="time-outline" label="Duración" value={formatDuration(totalTimeLessons)} />
        </View>

        <View className="mt-5 rounded-2xl bg-white px-5">
          <Text className="pt-5 text-lg font-bold text-slate-900">Contenido del curso</Text>
          {modules.map((item) => (
            <ModuleContent key={item.id} item={item} />
          ))}
          {!modules.length ? (
            <Text className="py-5 text-slate-500">Este curso aún no tiene contenido.</Text>
          ) : null}
        </View>
      </ScrollView>
      <CourseEnrollmentModal
        visible={isEnrollmentModalVisible}
        isLoading={enrollMutation.isPending}
        errorMessage={
          enrollMutation.isError
            ? 'No fue posible inscribirte en este curso. Inténtalo nuevamente.'
            : undefined
        }
        onConfirm={handleEnrollment}
        onClose={() => {
          if (!enrollMutation.isPending) {
            enrollMutation.reset();
            setIsEnrollmentModalVisible(false);
          }
        }}
      />
    </AuthScreen>
  );
}
