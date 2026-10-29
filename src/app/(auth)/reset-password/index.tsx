import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/src/modules/@core/view/components';
import { AuthService } from '@/src/modules/auth/data/services/auth_service';
import { AuthBrand } from '@/src/modules/auth/view/components/AuthBrand';
import { AuthScreen } from '@/src/modules/auth/view/components/AuthScreen';
import {
    resetPasswordSchema,
    type ResetPasswordFormData,
} from '@/src/modules/auth/view/schemas/reset-password.schema';

export default function ResetPasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: '', newPassword: '', confirmPassword: '' },
  });
  const { mutate: resetPassword, isPending } = AuthService.useResetPassword();

  const onSubmit = ({ token, newPassword }: ResetPasswordFormData) => {
    resetPassword(
      { token: token.trim(), newPassword },
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'Contraseña actualizada',
            text2: 'Ya puedes iniciar sesión.',
          });
          router.replace('/(auth)/login');
        },
        onError: () => {
          Toast.show({
            type: 'error',
            text1: 'No se pudo restablecer la contraseña',
            text2: 'El enlace puede ser inválido o haber expirado.',
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
          Restablecer contraseña
        </Text>
        <Text className="mb-6 text-base text-slate-500">
          Revisa tu bandeja de entrada, copia el token del correo y pégalo aquí
          para continuar.
        </Text>
        <Controller
          control={control}
          name="token"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Token de recuperación"
              placeholder="Pega aquí el token recibido por correo"
              autoCapitalize="none"
              autoCorrect={false}
              multiline
              textAlignVertical="top"
              inputClassName="min-h-32"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.token?.message}
            />
          )}
        />
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
          className="mt-2 mb-2"
        >
          {isPending ? 'Guardando...' : 'Restablecer contraseña'}
        </Button>
        <Link href="/(auth)/forgot-password" className="mt-6 text-center font-semibold text-[#1039B8]">
          Solicitar un nuevo token
        </Link>
      </View>
    </AuthScreen>
  );
}