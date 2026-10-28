import { Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6">
      <Text className="text-2xl font-bold text-slate-900">Perfil</Text>
      <Text className="mt-2 text-center text-slate-500">
        Tu información aparecerá aquí.
      </Text>
    </View>
  );
}
