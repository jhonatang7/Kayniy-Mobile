import { SymbolView } from 'expo-symbols';
import { Text, View } from 'react-native';

export function AuthBrand() {
  return (
    <View className="mb-8 items-center">
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-[#1039B8] shadow-sm">
        <SymbolView
          name={{ ios: 'graduationcap.fill', android: 'school', web: 'school' }}
          tintColor="#FFFFFF"
          size={42}
        />
      </View>
      <Text className="text-3xl font-bold text-slate-900">Kayniy</Text>
      <Text className="mt-1 text-center text-base text-slate-500">
        Aprende, crece y alcanza tus metas
      </Text>
    </View>
  );
}