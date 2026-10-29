import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/src/modules/@core/view/components';
import { AuthService } from '@/src/modules/auth/data/services/auth_service';
import { useAuth } from '@/src/modules/auth/providers/auth-provider';
import { AuthBrand } from '@/src/modules/auth/view/components/AuthBrand';
import { AuthScreen } from '@/src/modules/auth/view/components/AuthScreen';
import {
    firstLoginPasswordSchema,
    type FirstLoginPasswordFormData,
} from '@/src/modules/auth/view/schemas/first-login-password.schema';

export default function FirstLoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FirstLoginPasswordFormData>({
    resolver: zodResolver(firstLoginPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });
  const { mutate: setPassword, isPending } = AuthService.useSetFirstLoginPassword();
  const { refreshSession } = useAuth();

  const onSubmit = ({ newPassword }: FirstLoginPasswordFormData) => {
    setPassword(
      { newPassword },
      {
        onSuccess: async () => {
          await refreshSession();
          Toast.show({
            type: 'success',
            text1: 'Contraseña actualizada',
            text2: 'Bienvenido a Kayniy.',
          });
          router.replace('/(tabs)/home');
        },
        onError: () => {
          Toast.show({
            type: 'error',
            text1: 'No se pudo actualizar la contraseña',
            text2: 'Intenta nuevamente.',
          });
        },
      }
    );
  };

  return (
    <AuthScreen>
      <View className="rounded-3xl bg-white p-6 shadow-sm">
        <AuthBrand />
        <Text className="mb-1 text-2xl font-bold text-slate-900">
          Actualiza tu contraseña
        </Text>
        <Text className="mb-6 text-base text-slate-500">
          Por seguridad, establece una contraseña personal para continuar.
        </Text>

        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nueva contraseña"
              placeholder="••••••••"
              secureTextEntry
              autoComplete="new-password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.newPassword?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirmar contraseña"
              placeholder="••••••••"
              secureTextEntry
              autoComplete="new-password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
            />
          )}
        />
        <Button
          fullWidth
          onPress={() => void handleSubmit(onSubmit)()}
          disabled={isSubmitting || isPending}
          className="mt-2"
        >
          {isPending ? 'Guardando...' : 'Guardar contraseña'}
        </Button>
      </View>
    </AuthScreen>
  );
}