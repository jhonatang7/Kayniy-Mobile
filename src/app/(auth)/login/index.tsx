import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/src/modules/@core/view/components';
import { AuthService } from '@/src/modules/auth/data/services/auth_service';
import { useAuth } from '@/src/modules/auth/providers/auth-provider';
import { AuthBrand } from '@/src/modules/auth/view/components/AuthBrand';
import { AuthScreen } from '@/src/modules/auth/view/components/AuthScreen';
import {
  loginSchema,
  type LoginFormData,
} from '@/src/modules/auth/view/schemas/login.schema';

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const { mutate: login, isPending } = AuthService.useLogin();
  const { refreshSession } = useAuth();

  const onSubmit = (data: LoginFormData) => {
    Toast.show({
      type: 'info',
      text1: 'Iniciando sesión',
      text2: 'Verificando tus credenciales...',
    });

    login(data, {
      onSuccess: async (data) => {
        const user = await refreshSession(data.user);
        Toast.show({
          type: 'success',
          text1: 'Sesión iniciada',
          text2: 'Bienvenido a Kayniy.',
        });
        router.replace(user?.isFirstLogin ? '/(first-login)' : '/(tabs)/home');
      },
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1: 'No se pudo iniciar sesión',
          text2: error instanceof Error ? error.message : 'Intenta nuevamente.',
        });
      },
    });
  };

  const onInvalid = () => {
    Toast.show({
      type: 'error',
      text1: 'Revisa el formulario',
      text2: 'Completa correctamente tu email y contraseña.',
    });
  };

  return (
    <AuthScreen>
      <View className="rounded-3xl bg-white p-6 shadow-sm">
        <AuthBrand />
        <Text className="mb-1 text-2xl font-bold text-slate-900">Bienvenido</Text>
        <Text className="mb-6 text-base text-slate-500">
          Inicia sesión para continuar.
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="tu@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Contraseña"
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />

        <Button
          fullWidth
          onPress={() => void handleSubmit(onSubmit, onInvalid)()}
          disabled={isSubmitting || isPending}
          className="mt-2 mb-2"
        >
          {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>

        <Link href="/(auth)/forgot-password" className="mt-4 text-center font-semibold text-[#1039B8]">
          ¿Olvidaste tu contraseña?
        </Link>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-slate-500">¿Aún no tienes una cuenta? </Text>
          <Link href="/(auth)/register" className="font-semibold text-[#1039B8]">
            Regístrate
          </Link>
        </View>
      </View>
    </AuthScreen>
  );
}
