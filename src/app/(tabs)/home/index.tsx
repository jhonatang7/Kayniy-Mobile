import { AuthService } from '@/src/modules/auth/data/services/auth_service';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Linking, Pressable, ScrollView, Text, View } from 'react-native';

import { Card } from '@/src/modules/@core/view/components';
import { AuthScreen } from '@/src/modules/auth/view/components/AuthScreen';
import { useCommunityDetails } from '@/src/modules/community/data/services/community_service';
import { useRandomCourses } from '@/src/modules/course/data/services/course_service';
import type { RecommendedCourse } from '@/src/modules/course/main/types/course.types';
import { useCommunityLiveClasses } from '@/src/modules/live-class/data/services/live_class_service';
import type { LiveClass } from '@/src/modules/live-class/main/types/live-class.types';
import { useState } from 'react';

const liveCardColors = ['#E8EEFF', '#E8F7F1', '#FFF2DE'];
const courseCardColors = ['#FFF2DE', '#E8EEFF', '#F6EAFE'];
const levelLabels: Record<string, string> = {
  Basic: 'Básico',
  Medium: 'Intermedio',
  Advanced: 'Avanzado',
};

function LiveClassCard({ liveClass, index }: { liveClass: LiveClass; index: number }) {
  const isLive = liveClass.status === 'IN_LIVE';
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className="mr-4 w-80 p-5"
      style={{ backgroundColor: liveCardColors[index % liveCardColors.length], height: 320 }}
    >
      <View className="flex-1">
      <View className="flex-row items-start justify-between">
        <View className="mr-3 flex-1">
          <Text className="text-lg font-bold text-slate-900">{liveClass.title}</Text>
          <Text className="mt-2 text-sm leading-5 text-slate-500" numberOfLines={isExpanded ? 6 : 3}>
            {liveClass.description}
          </Text>
          {liveClass.description.length > 120 ? (
            <Pressable accessibilityRole="button" onPress={() => setIsExpanded(!isExpanded)}>
              <Text className="mt-2 text-sm font-bold text-[#1039B8]">
                {isExpanded ? 'Ver menos' : 'Ver más'}
              </Text>
            </Pressable>
          ) : null}
        </View>
        <View className={isLive ? 'rounded-full bg-red-500 px-3 py-1' : 'rounded-full bg-[#1039B8] px-3 py-1'}>
          <Text className="text-xs font-bold text-white">
            {isLive ? 'EN VIVO' : 'PRÓXIMO'}
          </Text>
        </View>
      </View>
      <View className="mt-5 border-t border-slate-100 pt-4">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="calendar-clock" size={18} color="#64748b" />
          <Text className="ml-2 flex-1 text-sm text-slate-600">{liveClass.timeLife}</Text>
        </View>
        <View className="mt-3 flex-row items-center">
          <MaterialCommunityIcons name="timer-outline" size={18} color="#64748b" />
          <Text className="ml-2 text-sm text-slate-600">{liveClass.duration}</Text>
        </View>
      </View>
      </View>
      <Pressable
        accessibilityRole="button"
        className={isLive ? 'mt-5 flex-row items-center justify-center rounded-xl bg-red-500 px-4 py-3' : 'mt-5 flex-row items-center justify-center rounded-xl bg-[#1039B8] px-4 py-3'}
        onPress={() => void Linking.openURL(liveClass.transmitionLink)}
      >
        <MaterialCommunityIcons name="play-circle-outline" size={20} color="#FFFFFF" />
        <Text className="ml-2 font-bold text-white">{isLive ? 'Entrar al live' : 'Ver enlace'}</Text>
      </Pressable>
    </Card>
  );
}

function RecommendedCourseCard({ course, index }: { course: RecommendedCourse; index: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      className="mr-4 w-64 rounded-3xl p-5 shadow-sm"
      style={{ backgroundColor: courseCardColors[index % courseCardColors.length] }}
      onPress={() =>
        router.push({ pathname: '/search/[courseId]', params: { courseId: course.id } })
      }
    >
        <View className="flex-row items-start justify-between">
          <Text className="flex-1 pr-2 text-lg font-bold text-slate-900" numberOfLines={2}>
            {course.name}
          </Text>
          <MaterialCommunityIcons name="arrow-top-right" size={20} color="#1039B8" />
        </View>
        <Text className="mt-3 self-start rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-[#1039B8]">
          {levelLabels[course.level] ?? course.level}
        </Text>
        <Text className="mt-4 text-sm leading-5 text-slate-600" numberOfLines={3}>
          {course.description}
        </Text>
        <View className="mt-5 border-t border-black/5 pt-3">
          <Text className="text-xs text-slate-500">Creado por</Text>
          <Text className="mt-1 text-sm font-semibold text-slate-800" numberOfLines={1}>
            {course.community.name}
          </Text>
        </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { data: user, isLoading: isUserLoading } = AuthService.useMe();
  const communityId = user?.community?.id;
  const { data: liveClasses, isLoading: areLiveClassesLoading, isError, refetch } =
    useCommunityLiveClasses(communityId);
  const {
    data: community,
    isLoading: isCommunityLoading,
    isError: isCommunityError,
  } = useCommunityDetails(communityId);
  const {
    data: recommendedCourses,
    isLoading: areRecommendedCoursesLoading,
    isError: areRecommendedCoursesError,
    refetch: refetchRecommendedCourses,
  } = useRandomCourses();

  return (
    <AuthScreen scrollable={false}>
      <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 24, paddingTop: 28, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="mb-8 flex-row items-center justify-between rounded-3xl bg-[#1039B8] px-5 py-5">
          <View>
            <Text className="text-xs font-bold uppercase tracking-widest text-blue-100">Aprende, comparte, crece</Text>
            <Text className="mt-1 text-4xl font-bold text-white">Kayniy</Text>
          </View>
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-amber-400">
            <MaterialCommunityIcons name="corn" size={34} color="#78350F" />
          </View>
        </View>

        {isUserLoading ? (
          <View className="items-center py-16">
            <ActivityIndicator size="large" color="#4f46e5" />
          </View>
        ) : !user?.community ? (
          <View className="rounded-3xl bg-indigo-600 p-6">
            <MaterialCommunityIcons name="broadcast" size={28} color="#e0e7ff" />
            <Text className="mt-4 text-2xl font-bold text-white">Únete a una comunidad</Text>
            <Text className="mt-3 text-base leading-6 text-indigo-100">
              Todavía no perteneces a una comunidad. Al unirte podrás ver los lives, enterarte de
              las novedades de tus cursos y hacer preguntas en vivo.
            </Text>
          </View>
        ) : (
          <View>
            <View className="mb-5 flex-row items-end justify-between">
              <View className="flex-1">
              <Text className="text-2xl font-bold text-slate-900">Lives de {user.community.name}</Text>
              <Text className="mt-2 text-base text-slate-500">Acompaña las próximas sesiones de tu comunidad.</Text>
              </View>
              <MaterialCommunityIcons name="broadcast" size={30} color="#1039B8" />
            </View>
            {areLiveClassesLoading ? (
              <View className="items-center py-16">
                <ActivityIndicator size="large" color="#4f46e5" />
              </View>
            ) : isError ? (
              <View className="items-center rounded-2xl bg-white p-6">
                <Text className="text-center text-base text-red-600">No fue posible cargar los lives.</Text>
                <Pressable className="mt-4" onPress={() => void refetch()}>
                  <Text className="font-semibold text-indigo-600">Intentar nuevamente</Text>
                </Pressable>
              </View>
            ) : liveClasses?.length ? (
              <FlatList
                data={liveClasses}
                horizontal
                keyExtractor={(liveClass) => liveClass.id}
                renderItem={({ item, index }) => <LiveClassCard liveClass={item} index={index} />}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <View className="rounded-2xl bg-white p-6">
                <Text className="text-center text-base text-slate-500">
                  No hay lives programados por ahora.
                </Text>
              </View>
            )}
          </View>
        )}
        <View className="mt-9">
          <View className="mb-5 flex-row items-end justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-slate-900">Cursos que te pueden interesar</Text>
              <Text className="mt-2 text-base text-slate-500">Descubre algo nuevo para aprender hoy.</Text>
            </View>
            <MaterialCommunityIcons name="school-outline" size={30} color="#D97706" />
          </View>
          {areRecommendedCoursesLoading ? (
            <View className="items-center py-10">
              <ActivityIndicator size="large" color="#1039B8" />
            </View>
          ) : areRecommendedCoursesError ? (
            <View className="rounded-2xl bg-white p-6">
              <Text className="text-center text-base text-red-600">No fue posible cargar los cursos.</Text>
              <Pressable className="mt-4 items-center" onPress={() => void refetchRecommendedCourses()}>
                <Text className="font-semibold text-[#1039B8]">Intentar nuevamente</Text>
              </Pressable>
            </View>
          ) : recommendedCourses?.length ? (
            <FlatList
              data={recommendedCourses}
              horizontal
              keyExtractor={(course) => course.id}
              renderItem={({ item, index }) => <RecommendedCourseCard course={item} index={index} />}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <View className="rounded-2xl bg-white p-6">
              <Text className="text-center text-base text-slate-500">No hay cursos recomendados por ahora.</Text>
            </View>
          )}
        </View>
        {communityId ? (
          <View className="mt-9 rounded-3xl bg-[#1039B8] p-6">
            {isCommunityLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : isCommunityError || !community ? (
              <Text className="text-center text-base text-blue-100">
                No fue posible cargar la información de tu comunidad.
              </Text>
            ) : (
              <>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="account-group" size={26} color="#FBBF24" />
                  <Text className="ml-3 flex-1 text-2xl font-bold text-white">
                    Perteneces a {community.name}
                  </Text>
                </View>
                <Text className="mt-4 text-xs leading-6 text-blue-100">
                  Esto es lo que tiene para decirnos la comunidad:
                </Text>
                <Text className="mt-2 text-base leading-6 text-white">{community.description}</Text>
              </>
            )}
          </View>
        ) : null}
        <View className="mt-9 rounded-3xl bg-slate-900 p-6">
          <View className="flex-row items-center">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-amber-400">
              <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#78350F" />
            </View>
            <Text className="ml-3 flex-1 text-2xl font-bold text-white">Sobre Kayniy</Text>
          </View>
          <Text className="mt-4 text-base leading-6 text-slate-300">
            Kayniy nace para acercar la enseñanza a comunidades lejanas y crear oportunidades de
            aprendizaje sin importar la distancia.
          </Text>
          <Text className="mt-3 text-base leading-6 text-slate-300">
            Nuestra misión es acompañar a cada comunidad con educación, colaboración y herramientas
            que ayuden a sus estudiantes a crecer.
          </Text>
          <View className="mt-5 rounded-2xl bg-white/10 p-4">
            <Text className="text-sm font-semibold text-amber-300">¿Quieres que tu comunidad use Kayniy?</Text>
            <Text className="mt-2 text-base font-bold text-white">Contáctanos al +591 65424745</Text>
          </View>
        </View>
      </ScrollView>
    </AuthScreen>
  );
}
