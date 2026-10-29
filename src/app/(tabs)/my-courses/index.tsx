import { Text, View } from 'react-native';

export default function MyCoursesScreen() {
  return (
    <View className="flex-1 bg-slate-50 px-6 py-10">
      <Text className="text-3xl font-bold text-slate-900">Mis cursos</Text>
      <Text className="mt-2 text-base text-slate-500">
        Aquí podrás continuar tus cursos inscritos.
      </Text>
      <View className="mt-8 items-center rounded-2xl bg-white p-6">
        <Text className="text-center text-base text-slate-500">
          Todavía no tienes cursos registrados.
        </Text>
      </View>
    </View>
  );
}