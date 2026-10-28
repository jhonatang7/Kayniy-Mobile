import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6">
      <Text className="text-2xl font-bold text-slate-900">Inicio</Text>
      <Text className="mt-2 text-center text-slate-500">
        Bienvenido a Kayniy.
      </Text>
    </View>
  );
}
