import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { AuthScreen } from '@/src/modules/auth/view/components/AuthScreen';
import {
    useLatestQuizAttempt,
    useQuizContent,
    useReviewQuiz,
} from '@/src/modules/course/data/services/course_service';
import type { LatestQuizAttempt, Question } from '@/src/modules/course/main/types/quiz.types';

function isMultipleSelection(question: Question) {
    return question.type === 'MULTIPLE_SELECTION';
}

function formatAttemptDate(attemptDate: string) {
    const date = new Date(attemptDate);
    return Number.isNaN(date.getTime()) ? attemptDate : date.toLocaleString('es-ES');
}

function AttemptFeedback({ attempt }: { attempt: LatestQuizAttempt }) {
    return (
        <View className={`mt-4 rounded-2xl border p-5 ${attempt.aprobed ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
            <View className="flex-row items-start">
                <Ionicons
                    name={attempt.aprobed ? 'checkmark-circle' : 'alert-circle'}
                    size={25}
                    color={attempt.aprobed ? '#198754' : '#C2410C'}
                />
                <View className="ml-3 flex-1">
                    <Text className={`text-base font-bold ${attempt.aprobed ? 'text-emerald-900' : 'text-amber-900'}`}>
                        {attempt.aprobed ? 'Ya aprobaste este examen' : 'Este intento no fue aprobado'}
                    </Text>
                    <Text className="mt-2 text-sm leading-5 text-slate-700">
                        Puntaje obtenido: {attempt.scoreGotten} puntos
                    </Text>
                    <Text className="mt-1 text-xs text-slate-500">
                        Intento realizado: {formatAttemptDate(attempt.attemptDate)}
                    </Text>
                    {!attempt.aprobed ? (
                        <Text className="mt-3 text-sm leading-5 font-semibold text-amber-900">
                            Puedes repetir el examen. Debes aprobarlo para completar el curso al 100%.
                        </Text>
                    ) : null}
                </View>
            </View>
        </View>
    );
}

function QuestionCard({
    question,
    selectedOptionIds,
    onToggleOption,
}: {
    question: Question;
    selectedOptionIds: string[];
    onToggleOption: (optionId: string) => void;
}) {
    const allowsMultiple = isMultipleSelection(question);

    return (
        <View className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
            <View className="flex-row items-start">
                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-[#1039B8]">
                    <Text className="text-sm font-bold text-white">{question.order}</Text>
                </View>
                <View className="flex-1">
                    <Text className="text-base font-bold leading-6 text-slate-900">{question.title}</Text>
                    {question.description ? (
                        <Text className="mt-2 text-sm leading-5 text-slate-500">{question.description}</Text>
                    ) : null}
                    <Text className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#3155A6]">
                        {allowsMultiple ? 'Selecciona una o más opciones' : 'Selecciona una opción'}
                    </Text>
                </View>
            </View>

            <View className="mt-4">
                {question.options.map((option, optionIndex) => {
                    const isSelected = selectedOptionIds.includes(option.id);
                    const iconName = allowsMultiple
                        ? isSelected ? 'checkbox' : 'square-outline'
                        : isSelected ? 'radio-button-on' : 'radio-button-off';

                    return (
                        <Pressable
                            key={option.id}
                            accessibilityRole={allowsMultiple ? 'checkbox' : 'radio'}
                            accessibilityState={{ checked: isSelected }}
                            className={`mb-3 flex-row items-center rounded-xl border px-4 py-3 ${isSelected ? 'border-blue-700 bg-blue-50' : 'border-slate-200 bg-white'}`}
                            onPress={() => onToggleOption(option.id)}
                        >
                            <Ionicons name={iconName} size={22} color={isSelected ? '#1D4ED8' : '#94A3B8'} />
                            <Text className={`ml-3 flex-1 text-sm leading-5 ${isSelected ? 'font-semibold text-blue-900' : 'text-slate-700'}`}>
                                {String.fromCharCode(65 + optionIndex)}. {option.content}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

export default function QuizScreen() {
    const params = useLocalSearchParams<{ 'my-courseId': string; quizId: string }>();
    const courseEnrollmentId = Array.isArray(params['my-courseId']) ? params['my-courseId'][0] : params['my-courseId'];
    const quizId = Array.isArray(params.quizId) ? params.quizId[0] : params.quizId;
    const quizContent = useQuizContent(quizId ?? '');
    const latestQuizAttempt = useLatestQuizAttempt(quizId ?? '', courseEnrollmentId ?? '');
    const reviewQuiz = useReviewQuiz();
    const [hasAcceptedRules, setHasAcceptedRules] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

    const questions = useMemo(
        () => [...(quizContent.data?.questions ?? [])].sort((first, second) => first.order - second.order),
        [quizContent.data?.questions]
    );
    const answeredQuestionCount = questions.filter((question) => (selectedOptions[question.id]?.length ?? 0) > 0).length;
    const isComplete = questions.length > 0 && answeredQuestionCount === questions.length;
    const hasApprovedAttempt = latestQuizAttempt.data?.aprobed === true;
    const isSubmitDisabled = !isComplete || reviewQuiz.isPending || latestQuizAttempt.isLoading || hasApprovedAttempt;

    const handleSubmit = async () => {
        if (!quizId || !courseEnrollmentId || isSubmitDisabled) return;

        try {
            const reviewResult = await reviewQuiz.mutateAsync({
                quizId,
                courseEnrollmentId,
                questions: questions.map((question) => ({
                    questionId: question.id,
                    answers: selectedOptions[question.id] ?? [],
                })),
            });

            Toast.show({
                type: 'success',
                text1: 'Examen enviado',
                text2: 'Tus respuestas fueron registradas correctamente.',
            });
            router.replace({
                pathname: '/my-courses/[my-courseId]/lesson/[lessonId]',
                params: { 'my-courseId': courseEnrollmentId, lessonId: reviewResult.lessonId },
            } as never);
        } catch {
            Toast.show({
                type: 'error',
                text1: 'No se pudo enviar el examen',
                text2: 'Revisa tu conexión e inténtalo nuevamente.',
            });
        }
    };

    const toggleOption = (question: Question, optionId: string) => {
        setSelectedOptions((currentSelections) => {
            const currentQuestionSelections = currentSelections[question.id] ?? [];

            if (isMultipleSelection(question)) {
                const nextSelections = currentQuestionSelections.includes(optionId)
                    ? currentQuestionSelections.filter((selectedId) => selectedId !== optionId)
                    : [...currentQuestionSelections, optionId];

                return { ...currentSelections, [question.id]: nextSelections };
            }

            return { ...currentSelections, [question.id]: [optionId] };
        });
    };

    if (!quizId) {
        return (
            <AuthScreen scrollable={false}>
                <View className="flex-1 items-center justify-center bg-slate-50 px-6">
                    <Ionicons name="alert-circle-outline" size={36} color="#64748B" />
                    <Text className="mt-3 text-center text-base text-slate-600">No se encontró el identificador del examen.</Text>
                </View>
            </AuthScreen>
        );
    }

    if (quizContent.isLoading) {
        return (
            <AuthScreen scrollable={false}>
                <View className="flex-1 items-center justify-center bg-slate-50">
                    <ActivityIndicator size="large" color="#1039B8" />
                    <Text className="mt-3 text-sm text-slate-500">Cargando examen...</Text>
                </View>
            </AuthScreen>
        );
    }

    if (quizContent.isError || !quizContent.data) {
        return (
            <AuthScreen scrollable={false}>
                <View className="flex-1 items-center justify-center bg-slate-50 px-6">
                    <Ionicons name="alert-circle-outline" size={36} color="#C2410C" />
                    <Text className="mt-3 text-center text-base text-slate-600">No pudimos cargar este examen.</Text>
                    <Pressable className="mt-4 rounded-xl bg-[#1039B8] px-5 py-3" onPress={() => void quizContent.refetch()}>
                        <Text className="font-semibold text-white">Intentar nuevamente</Text>
                    </Pressable>
                </View>
            </AuthScreen>
        );
    }

    const evaluation = quizContent.data;

    return (
        <AuthScreen scrollable={false}>
            <Stack.Screen options={{ headerShown: false, title: evaluation.name }} />
            {!hasAcceptedRules ? (
                <ScrollView className="flex-1 bg-slate-50" contentContainerClassName="px-5 pb-10 pt-6">
                    <View className="rounded-3xl bg-[#1039B8] p-6">
                        <Ionicons name="clipboard-outline" size={34} color="#BFDBFE" />
                        <Text className="mt-4 text-2xl font-bold text-white">Antes de comenzar</Text>
                        <Text className="mt-2 text-sm leading-5 text-blue-100">Lee estas condiciones antes de iniciar tu evaluación.</Text>
                    </View>

                    <View className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
                        <View className="flex-row items-center border-b border-slate-100 pb-4">
                            <Ionicons name="stats-chart-outline" size={24} color="#1039B8" />
                            <View className="ml-3 flex-1">
                                <Text className="text-sm text-slate-500">Puntaje total</Text>
                                <Text className="mt-1 text-xl font-bold text-slate-900">100 puntos</Text>
                            </View>
                        </View>
                        <View className="mt-4 flex-row items-start">
                            <Ionicons name="ribbon-outline" size={24} color="#1039B8" />
                            <Text className="ml-3 flex-1 text-sm leading-5 text-slate-600">
                                El valor de cada pregunta fue definido por el profesor. La suma de todas las preguntas siempre equivale a 100 puntos.
                            </Text>
                        </View>
                        <View className="mt-4 flex-row items-start">
                            <Ionicons name="time-outline" size={24} color="#C2410C" />
                            <Text className="ml-3 flex-1 text-sm leading-5 text-slate-600">
                                No dejes pasar el tiempo una vez que comiences. Tus respuestas se enviarán juntas al finalizar.
                            </Text>
                        </View>
                        <View className="mt-4 flex-row items-start">
                            <Ionicons name="repeat-outline" size={24} color="#C2410C" />
                            <Text className="ml-3 flex-1 text-sm leading-5 text-slate-600">
                                Puedes tener más intentos, pero todos serán monitoreados. Procura no realizar intentos innecesarios.
                            </Text>
                        </View>
                        <View className="mt-4 flex-row items-start">
                            <Ionicons name="checkmark-circle-outline" size={24} color="#198754" />
                            <Text className="ml-3 flex-1 text-sm leading-5 text-slate-600">
                                Puntaje mínimo para aprobar: {evaluation.passingScore} puntos.
                            </Text>
                        </View>
                    </View>

                    <Pressable className="mt-6 items-center rounded-xl bg-[#1039B8] px-5 py-4" onPress={() => setHasAcceptedRules(true)}>
                        <Text className="font-bold text-white">Estoy de acuerdo y comenzar</Text>
                    </Pressable>
                    {latestQuizAttempt.data ? <AttemptFeedback attempt={latestQuizAttempt.data} /> : null}
                </ScrollView>
            ) : (
                <ScrollView className="flex-1 bg-slate-50" contentContainerClassName="px-5 pb-10 pt-6">
                    <Text className="text-2xl font-bold text-slate-900">{evaluation.name}</Text>
                    {evaluation.description ? (
                        <Text className="mt-2 text-base leading-6 text-slate-600">{evaluation.description}</Text>
                    ) : null}
                    <View className="mt-5 flex-row items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
                        <Text className="text-sm font-semibold text-blue-900">{questions.length} preguntas</Text>
                        <Text className="text-sm font-semibold text-blue-900">{answeredQuestionCount}/{questions.length} respondidas</Text>
                    </View>

                    {questions.map((question) => (
                        <QuestionCard
                            key={question.id}
                            question={question}
                            selectedOptionIds={selectedOptions[question.id] ?? []}
                            onToggleOption={(optionId) => toggleOption(question, optionId)}
                        />
                    ))}

                    <Pressable
                        className={`mt-6 items-center rounded-xl px-5 py-4 ${isSubmitDisabled ? 'bg-slate-300' : 'bg-[#1039B8]'}`}
                        disabled={isSubmitDisabled}
                        onPress={() => void handleSubmit()}
                    >
                        <Text className={`font-bold ${isSubmitDisabled ? 'text-slate-500' : 'text-white'}`}>
                            {reviewQuiz.isPending
                                ? 'Enviando examen...'
                                : latestQuizAttempt.isLoading
                                    ? 'Verificando intento...'
                                    : hasApprovedAttempt
                                        ? 'Examen aprobado'
                                        : isComplete
                                            ? 'Enviar examen'
                                            : 'Responde todas las preguntas'}
                        </Text>
                    </Pressable>

                </ScrollView>
            )}
        </AuthScreen>
    );
}