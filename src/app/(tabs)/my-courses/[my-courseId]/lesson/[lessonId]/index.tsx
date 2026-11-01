import { Ionicons } from '@expo/vector-icons';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Linking,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Toast from 'react-native-toast-message';
import YoutubePlayer from 'react-native-youtube-iframe';

import { AuthScreen } from '@/src/modules/auth/view/components/AuthScreen';
import {
    useCompleteCourse,
    useCompleteModuleProgress,
    useCourseContent,
    useLessonContent,
    useRegisterLessonProgress,
} from '@/src/modules/course/data/services/course_service';
import type {
    Content,
    ContentType,
    Module,
} from '@/src/modules/course/main/types/course-content.types';

const contentIcon: Record<ContentType, keyof typeof Ionicons.glyphMap> = {
    VIDEO: 'play-circle-outline',
    DOCUMENT: 'document-text-outline',
    QUIZ: 'help-circle-outline',
};

const contentTypeLabel: Record<ContentType, string> = {
    VIDEO: 'Video',
    DOCUMENT: 'Documento',
    QUIZ: 'Examen',
};

const getYoutubeId = (url: string) => {
    if (!url) return ''; 

    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
    return match?.[1] ?? url;
};

const formatDuration = (duration: number | null) => {
    if (duration === null) return null;
    return `${duration} min`;
};

function ContentStatus({ content }: { content: Content }) {
    if (content.type === 'QUIZ') {
        const status = content.status ?? 'NOT_STARTED';
        const statusLabel = {
            PASSED: 'Aprobado',
            FAILED: 'Reintentar',
            NOT_STARTED: 'Pendiente',
        }[status];
        const statusColor = status === 'PASSED' ? '#198754' : status === 'FAILED' ? '#C2410C' : '#64748B';

        return <Text className="text-xs font-semibold" style={{ color: statusColor }}>{statusLabel}</Text>;
    }

    return content.isCompleted ? (
        <Ionicons name="checkmark-circle" size={20} color="#198754" />
    ) : (
        <Ionicons name="ellipse-outline" size={20} color="#94A3B8" />
    );
}

function ModuleSection({
    module,
    courseId,
    activeContentId,
    isCompleting,
    onComplete,
}: {
    module: Module;
    courseId: string;
    activeContentId: string;
    isCompleting: boolean;
    onComplete: (moduleId: string) => void;
}) {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    return (
        <View className="mb-5 rounded-2xl bg-white p-4 shadow-sm">
            <View className="flex-row items-start">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-slate-900">
                    <Text className="text-sm font-bold text-white">M{module.order}</Text>
                </View>
                <View className="flex-1">
                    <Text className="text-base font-bold text-slate-900">{module.title}</Text>
                    <Text className="mt-1 text-sm leading-5 text-slate-500" numberOfLines={isDescriptionExpanded ? undefined : 3}>
                        {module.description}
                    </Text>
                    {module.description.length > 150 && (
                        <Pressable onPress={() => setIsDescriptionExpanded((expanded) => !expanded)}>
                            <Text className="mt-1 text-xs font-semibold text-[#3155A6]">
                                {isDescriptionExpanded ? 'Ver menos' : 'Ver más'}
                            </Text>
                        </Pressable>
                    )}
                    <Text className="mt-2 text-xs font-semibold text-slate-500">
                        {module.isCompleted ? '✓ Módulo completado' : 'Módulo en progreso'}
                    </Text>
                </View>
            </View>

            <View className="mt-4 border-t border-slate-100 pt-2">
                {module.contents.map((content) => (
                    <Link
                        key={content.id}
                        href={{
                            pathname: content.type === 'QUIZ' ? '/my-courses/[my-courseId]/quiz/[quizId]' : '/my-courses/[my-courseId]/lesson/[lessonId]',
                            params: content.type === 'QUIZ'
                                ? { 'my-courseId': courseId, quizId: content.id }
                                : { 'my-courseId': courseId, lessonId: content.id },
                        } as never}
                        asChild
                    >
                        <Pressable className={`flex-row items-center border-b border-slate-100 py-3 last:border-b-0 ${content.id === activeContentId ? 'border-l-4 border-l-[#3155A6] bg-blue-50 pl-3' : ''}`}>
                            <Ionicons name={contentIcon[content.type]} size={23} color={content.id === activeContentId ? '#1D4ED8' : '#3155A6'} />
                            <View className="ml-3 flex-1">
                                <Text className={`text-sm font-semibold ${content.id === activeContentId ? 'text-blue-800' : 'text-slate-800'}`}>{content.title}</Text>
                                <View className="mt-1 flex-row items-center">
                                    <Text className={`text-xs ${content.id === activeContentId ? 'text-blue-600' : 'text-slate-400'}`}>{contentTypeLabel[content.type]}</Text>
                                    {formatDuration(content.duration) && (
                                        <Text className={`ml-2 text-xs ${content.id === activeContentId ? 'text-blue-600' : 'text-slate-400'}`}>{formatDuration(content.duration)}</Text>
                                    )}
                                </View>
                            </View>
                            <ContentStatus content={content} />
                        </Pressable>
                    </Link>
                ))}
            </View>

            <Pressable
                className={`mt-4 flex-row items-center justify-center rounded-xl px-4 py-3 ${module.isCompleted || isCompleting ? 'bg-slate-200' : 'bg-[#1039B8]'}`}
                disabled={module.isCompleted || isCompleting}
                onPress={() => onComplete(module.id)}
            >
                <Ionicons
                    name={module.isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={20}
                    color={module.isCompleted || isCompleting ? '#64748B' : '#FFFFFF'}
                />
                <Text className={`ml-2 text-sm font-bold ${module.isCompleted || isCompleting ? 'text-slate-500' : 'text-white'}`}>
                    {isCompleting ? 'Guardando módulo...' : module.isCompleted ? 'Módulo completado' : 'Marcar módulo como terminado'}
                </Text>
            </Pressable>
        </View>
    );
}

export default function LessonScreen() {
    const params = useLocalSearchParams<{ 'my-courseId': string; lessonId: string }>();
    const courseId = Array.isArray(params['my-courseId']) ? params['my-courseId'][0] : params['my-courseId'];
    const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId;
    const courseContent = useCourseContent(courseId ?? '');
    const lessonContent = useLessonContent(lessonId ?? '');
    const registerLessonProgress = useRegisterLessonProgress(courseId ?? '');
    const completeModuleProgress = useCompleteModuleProgress(courseId ?? '');
    const completeCourse = useCompleteCourse();
    const orderedModules = useMemo(
        () => [...(courseContent.data?.modules ?? [])].sort((a, b) => a.order - b.order),
        [courseContent.data?.modules]
    );
    const allContents = orderedModules.flatMap((module) => module.contents);
    const currentIndex = allContents.findIndex((content) => content.id === lessonId);
    const nextContent = currentIndex >= 0 ? allContents[currentIndex + 1] : undefined;
    const lesson = lessonContent.data;
    const isNextContentCompleted = nextContent?.isCompleted ?? false;
    const isCourseCompleted = courseContent.data?.enrollment.isCompleted ?? false;

    const handleOpenPdf = async () => {
        if (!lesson || lesson.type !== 'DOCUMENT') return;

        try {
            await Linking.openURL(lesson.urlContent);
        } catch {
            Toast.show({
                type: 'error',
                text1: 'No se pudo abrir el documento',
                text2: 'Verifica que el enlace del PDF sea válido.',
            });
        }
    };

    const handleCompleteCourse = async () => {
        if (!courseId || isCourseCompleted || completeCourse.isPending) return;

        try {
            await completeCourse.mutateAsync({ courseEnrollmentId: courseId });
            Toast.show({
                type: 'success',
                text1: 'Curso completado',
                text2: 'Tu progreso fue actualizado correctamente.',
            });
            router.replace('/(tabs)/my-courses');
        } catch {
            Toast.show({
                type: 'error',
                text1: 'No se pudo completar el curso',
                text2: 'Verifica que hayas terminado todo el contenido.',
            });
        }
    };
    
    const handleCompleteModule = async (moduleId: string) => {
        if (completeModuleProgress.isPending) return;

        try {
            await completeModuleProgress.mutateAsync({
                moduleId,
                courseEnrollmentId: courseId,
            });
            Toast.show({
                type: 'success',
                text1: 'Módulo completado',
                text2: 'Tu progreso fue actualizado correctamente.',
            });
        } catch {
            Toast.show({
                type: 'error',
                text1: 'No se pudo completar el módulo',
                text2: 'Verifica haber terminado todo el contenido del módulo',
            });
        }
    };

    const handleNextContent = async () => {
        if (!nextContent || isNextContentCompleted || registerLessonProgress.isPending) return;

        try {
            await registerLessonProgress.mutateAsync({
                lessonId,
                courseEnrollmentId: courseId,
            });
            Toast.show({
                type: 'success',
                text1: 'Lección completada',
                text2: 'Tu progreso fue registrado correctamente.',
            });

            router.push({
                pathname: nextContent.type === 'QUIZ'
                    ? '/my-courses/[my-courseId]/quiz/[quizId]'
                    : '/my-courses/[my-courseId]/lesson/[lessonId]',
                params: nextContent.type === 'QUIZ'
                    ? { 'my-courseId': courseId, quizId: nextContent.id }
                    : { 'my-courseId': courseId, lessonId: nextContent.id },
            } as never);
        } catch {
            Toast.show({
                type: 'error',
                text1: 'No se pudo registrar el progreso',
                text2: 'Revisa tu conexión e inténtalo nuevamente.',
            });
        }
    };

    if (!courseId || !lessonId) {
        return (
            <AuthScreen scrollable={false} edges={['bottom']}>
                <View className="flex-1 items-center justify-center bg-slate-50 px-6">
                    <Ionicons name="alert-circle-outline" size={36} color="#64748B" />
                    <Text className="mt-3 text-center text-base text-slate-600">
                        No se encontraron los datos de la lección.
                    </Text>
                </View>
            </AuthScreen>
        );
    }

    return (
        <AuthScreen scrollable={false} edges={['bottom']}>
            <Stack.Screen options={{ title: lesson?.title ?? 'Lección' }} />
            <View className="flex-1 bg-slate-50">
                <View className="overflow-hidden bg-black" style={{ height: lesson?.type === 'VIDEO' ? 220 : 360 }}>
                    {lessonContent.isLoading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color="#CBD5E1" />
                        </View>
                    ) : lessonContent.isError || !lesson ? (
                        <View className="flex-1 items-center justify-center px-6">
                            <Ionicons name="alert-circle-outline" size={32} color="#CBD5E1" />
                            <Text className="mt-2 text-center text-sm text-slate-300">El contenido multimedia no está disponible.</Text>
                        </View>
                    ) : lesson.type === 'VIDEO' ? (
                        <YoutubePlayer height={220} play={false} videoId={getYoutubeId(lesson.urlContent)} />
                    ) : (
                        <Pdf
                            source={{ uri: lesson.urlContent }}
                            style={{ flex: 1 }}
                            trustAllCerts={false}
                            spacing={10}
                        />
                    )}
                </View>

                <ScrollView className="flex-1" contentContainerClassName="pb-8" nestedScrollEnabled>

                <View className="px-5 pt-5">
                {lessonContent.isLoading ? (
                    <View className="items-center py-4">
                        <ActivityIndicator color="#3155A6" />
                        <Text className="mt-2 text-sm text-slate-500">Cargando descripción...</Text>
                    </View>
                ) : lessonContent.isError || !lesson ? (
                    <Text className="text-sm text-slate-500">La descripción no está disponible.</Text>
                ) : (
                    <>
                        <Text className="text-lg font-bold text-slate-900">Descripción</Text>
                        <Text className="mt-2 text-base leading-6 text-slate-600">{lesson.description}</Text>
                        {lesson.type === 'DOCUMENT' ? (
                            <View className="mt-4 rounded-xl bg-blue-50 px-4 py-3">
                                <Text className="text-sm font-semibold text-slate-700">Visualiza el PDF en pantalla completa:</Text>
                                <Pressable className="mt-1 self-start" onPress={() => void handleOpenPdf()}>
                                    <Text className="text-sm font-bold text-[#3155A6]">Pulsa aquí para abrir el PDF</Text>
                                </Pressable>
                            </View>
                        ) : null}
                    </>
                )}

                {nextContent && !courseContent.isLoading && !courseContent.isError && (
                    <Pressable
                        className={`mt-5 flex-row items-center justify-between rounded-xl px-4 py-4 ${registerLessonProgress.isPending || isNextContentCompleted ? 'bg-slate-400' : 'bg-[#3155A6]'}`}
                        disabled={registerLessonProgress.isPending || isNextContentCompleted}
                        onPress={() => void handleNextContent()}
                    >
                        <View className="flex-1">
                            <Text className="text-xs font-semibold text-blue-100">
                                {registerLessonProgress.isPending ? 'Registrando progreso' : isNextContentCompleted ? 'Contenido completado' : 'Siguiente contenido'}
                            </Text>
                            <Text className="mt-1 font-bold text-white" numberOfLines={1}>{nextContent.title}</Text>
                        </View>
                        <Ionicons name="arrow-forward" size={22} color="white" />
                    </Pressable>
                )}

                <Text className="mb-3 mt-7 text-lg font-bold text-slate-900">Contenido del curso</Text>
                {courseContent.isLoading ? (
                    <View className="items-center rounded-2xl bg-white py-8">
                        <ActivityIndicator color="#3155A6" />
                        <Text className="mt-2 text-sm text-slate-500">Cargando contenido del curso...</Text>
                    </View>
                ) : courseContent.isError ? (
                    <View className="items-center rounded-2xl bg-white px-5 py-8">
                        <Ionicons name="alert-circle-outline" size={32} color="#94A3B8" />
                        <Text className="mt-2 text-center text-sm text-slate-500">No pudimos cargar la lista del curso.</Text>
                    </View>
                ) : orderedModules.length === 0 ? (
                    <Text className="text-sm text-slate-500">Este curso todavía no tiene contenido.</Text>
                ) : (
                    <>
                        {orderedModules.length === 0 ? (
                            <Text className="text-sm text-slate-500">Este curso todavía no tiene contenido.</Text>
                        ) : (
                            orderedModules.map((module) => (
                                <ModuleSection
                                    key={module.id}
                                    module={module}
                                    courseId={courseId}
                                    activeContentId={lessonId}
                                    isCompleting={completeModuleProgress.isPending}
                                    onComplete={handleCompleteModule}
                                />
                            ))
                        )}
                        <Pressable
                            className={`mt-2 flex-row items-center justify-center rounded-xl px-4 py-4 ${isCourseCompleted || completeCourse.isPending ? 'bg-slate-200' : 'bg-[#1039B8]'}`}
                            disabled={isCourseCompleted || completeCourse.isPending}
                            onPress={() => void handleCompleteCourse()}
                        >
                            <Ionicons
                                name={isCourseCompleted ? 'checkmark-circle' : 'trophy-outline'}
                                size={21}
                                color={isCourseCompleted || completeCourse.isPending ? '#64748B' : '#FFFFFF'}
                            />
                            <Text className={`ml-2 text-sm font-bold ${isCourseCompleted || completeCourse.isPending ? 'text-slate-500' : 'text-white'}`}>
                                {completeCourse.isPending ? 'Finalizando curso...' : isCourseCompleted ? 'Curso completado' : 'Marcar curso como finalizado'}
                            </Text>
                        </Pressable>
                    </>
                )}
                </View>
                </ScrollView>
            </View>
        </AuthScreen>
    );
}