import { useState } from 'react';
import { Text, View } from 'react-native';

import { Input } from '@/src/modules/@core/view/components';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <View className="flex-1 bg-slate-50 px-6 py-10">
      <Text className="text-3xl font-bold text-slate-900">Buscar cursos</Text>
      <Text className="mt-2 text-base text-slate-500">
        Encuentra el curso que quieres aprender.
      </Text>
      <Input
        label="Buscar"
        placeholder="Ej. Matemáticas, programación..."
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        returnKeyType="search"
        containerClassName="mt-8"
      />
      <View className="mt-8 items-center rounded-2xl bg-white p-6">
        <Text className="text-center text-base text-slate-500">
          {query.trim()
            ? 'No encontramos cursos con esa búsqueda.'
            : 'Escribe algo para comenzar a buscar.'}
        </Text>
      </View>
    </View>
  );
}