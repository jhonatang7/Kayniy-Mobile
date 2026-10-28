import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/src/modules/@core/view/components';
import { StudentService } from '@/src/modules/student/data/services/student_service';
import { AuthBrand } from '@/src/modules/student/view/components/AuthBrand';
import { AuthScreen } from '@/src/modules/student/view/components/AuthScreen';
import {
    registerSchema,
    type RegisterFormData,
} from '@/src/modules/student/view/schemas/register.schema';

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
  });
  const { mutate: register, isPending } = StudentService.useRegister();

  const onSubmit = (data: RegisterFormData) => {
    Toast.show({
      type: 'info',
      text1: 'Creando cuenta',
      text2: 'Enviando tus datos...',
    });

    register(data, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Cuenta creada',
          text2: 'Bienvenido a Kayniy.',
        });
        router.replace('/(tabs)/home');
      },
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1: 'No se pudo crear la cuenta',
          text2: error instanceof Error ? error.message : 'Intenta nuevamente.',
        });
      },
    });
  };

  const onInvalid = () => {
    Toast.show({
      type: 'error',
      text1: 'Revisa el formulario',
      text2: 'Completa correctamente todos los campos.',
    });
  };

  return (
    <AuthScreen>
      <View className="rounded-3xl bg-white p-6 shadow-sm">
        <AuthBrand />
        <Text className="mb-1 text-2xl font-bold text-slate-900">
          Crea tu cuenta
        </Text>
        <Text className="mb-6 text-base text-slate-500">
          Completa tus datos para empezar.
        </Text>

        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nombre"
              placeholder="Juan"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.firstName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Apellido"
              placeholder="Pérez"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.lastName?.message}
            />
          )}
        />
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
          name="phoneNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Teléfono"
              placeholder="+591 65458454"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.phoneNumber?.message}
            />
          )}
        />

        <Button
          fullWidth
          onPress={() => void handleSubmit(onSubmit, onInvalid)()}
          disabled={isSubmitting || isPending}
          className="mt-2"
        >
          {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-slate-500">¿Ya tienes una cuenta? </Text>
          <Link href="/(auth)/login" className="font-semibold text-[#1039B8]">
            Inicia sesión
          </Link>
        </View>
      </View>
    </AuthScreen>
  );
}
