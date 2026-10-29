import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button, Input } from '@/src/modules/@core/view/components';
import { AuthService } from '@/src/modules/auth/data/services/auth_service';
import { AuthBrand } from '@/src/modules/auth/view/components/AuthBrand';
import { AuthScreen } from '@/src/modules/auth/view/components/AuthScreen';
import {
    forgotPasswordSchema,
    type ForgotPasswordFormData,
} from '@/src/modules/auth/view/schemas/forgot-password.schema';

export default function ForgotPasswordScreen() {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    });
    const { mutate: forgotPassword, isPending } = AuthService.useForgotPassword();

    const onSubmit = (data: ForgotPasswordFormData) => {
        forgotPassword(data, {
            onSuccess: () => {
                reset();
                Toast.show({
                    type: 'success',
                    text1: 'Correo enviado',
                    text2: 'Revisa tu correo para restablecer tu contraseña.',
                });
            },
            onError: () => {
                Toast.show({
                    type: 'error',
                    text1: 'No se pudo enviar el correo',
                    text2: 'Intenta nuevamente.',
                });
            },
        });
    };

    return (
        <AuthScreen>
            <View className="rounded-3xl bg-white p-6 shadow-sm">
                <AuthBrand />
                <Text className="mb-1 text-2xl font-bold text-slate-900">
                    Recuperar contraseña
                </Text>
                <Text className="mb-6 text-base text-slate-500">
                    Ingresa tu correo y te enviaremos un enlace para restablecerla.
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

                <Button
                    fullWidth
                    onPress={() => void handleSubmit(onSubmit)()}
                    disabled={isSubmitting || isPending}
                    className="mt-2"
                >
                    {isPending ? 'Enviando...' : 'Enviar enlace'}
                </Button>

                <View className="mt-6 items-center">
                    <Link href="/(auth)/login" className="text-center font-semibold text-[#1039B8]">
                        Volver al inicio de sesión
                    </Link>
                    <Link href="/(auth)/reset-password" className="mt-4 text-center font-semibold text-[#1039B8]">
                        Ya recibí mi token
                    </Link>
                </View>
            </View>
        </AuthScreen>
    );
}