import { Stack } from 'expo-router';

export default function LessonLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: '#0F172A' },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: { fontWeight: '700' },
            }}
        />
    );
}
