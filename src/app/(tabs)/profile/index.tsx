import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import {
    AppModal,
    Avatar,
    Button,
    ConfirmationModal,
    Input,
} from '@/src/modules/@core/view/components';
import { AuthService } from '@/src/modules/auth/data/services/auth_service';
import { AuthScreen } from '@/src/modules/auth/view/components/AuthScreen';
import {
    changePasswordSchema,
    type ChangePasswordFormData,
} from '@/src/modules/auth/view/schemas/change-password.schema';
import {
    profileSchema,
    type ProfileFormData,
} from '@/src/modules/auth/view/schemas/profile.schema';

function ProfileInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="border-b border-slate-100 py-3 last:border-b-0">
      <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </Text>
      <Text className="mt-1 text-base text-slate-900">{value}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { data: user, isLoading: isUserLoading } = AuthService.useMe();
  const { mutate: updateProfile, isPending: isUpdating } = AuthService.useUpdateProfile();
  const { mutate: changePassword, isPending: isChangingPassword } = AuthService.useChangePassword();
  const { mutate: logout, isPending: isLoggingOut } = AuthService.useLogout();
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: '', lastName: '', phoneNumber: '' },
  });
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [resetProfile, user]);

  const openProfileModal = () => {
    if (user) {
      resetProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      });
    }
    setIsProfileModalVisible(true);
  };

  const submitProfile = (data: ProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => {
        setIsProfileModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Perfil actualizado',
          text2: 'Tu información fue guardada correctamente.',
        });
      },
      onError: () => {
        Toast.show({
          type: 'error',
          text1: 'No se pudo actualizar el perfil',
          text2: 'Intenta nuevamente.',
        });
      },
    });
  };

  const submitPassword = ({ currentPassword, newPassword }: ChangePasswordFormData) => {
    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          resetPassword();
          setIsPasswordModalVisible(false);
          Toast.show({
            type: 'success',
            text1: 'Contraseña actualizada',
            text2: 'Tu contraseña fue cambiada correctamente.',
          });
        },
        onError: () => {
          Toast.show({
            type: 'error',
            text1: 'No se pudo cambiar la contraseña',
            text2: 'Verifica tu contraseña actual e intenta nuevamente.',
          });
        },
      }
    );
  };

  const confirmLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setIsLogoutModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Sesión cerrada',
          text2: 'Hasta pronto.',
        });
        router.replace('/(auth)/login');
      },
      onError: () => {
        Toast.show({
          type: 'error',
          text1: 'No se pudo cerrar la sesión',
          text2: 'Intenta nuevamente.',
        });
      },
    });
  };

  if (isUserLoading || !user) {
    return (
      <AuthScreen>
        <View className="items-center rounded-2xl border border-slate-200 bg-white p-6">
          <Text className="text-base text-slate-500">Cargando perfil...</Text>
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
    <View className="items-center">
      <Avatar
        name={`${user.firstName} ${user.lastName}`}
        email={user.email}
        avatarPath={user.avatarPath}
      />
      <Text className="mt-5 text-center text-3xl font-bold text-slate-900">
        {user.firstName} {user.lastName}
      </Text>
      <Text className="mt-2 text-center text-base text-slate-500">{user.email}</Text>
      <Text className="mt-1 text-center text-base text-slate-500">{user.phoneNumber}</Text>

      <View className="mt-8 w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <Text className="text-lg font-bold text-slate-900">Información personal</Text>
        <ProfileInfoRow label="Nombre" value={user.firstName} />
        <ProfileInfoRow label="Apellido" value={user.lastName} />
        <ProfileInfoRow label="Email" value={user.email} />
        <ProfileInfoRow label="Celular" value={user.phoneNumber} />
      </View>

      <View className="mt-8 w-full max-w-sm">
        <Text className="text-lg font-bold text-slate-900">Datos personales</Text>
        <Text className="mt-1 mb-3 text-sm text-slate-500">
          Modifica tu nombre, apellido o número de celular.
        </Text>
        <Button fullWidth onPress={openProfileModal}>
          Actualizar información
        </Button>
        <Text className="mt-6 text-lg font-bold text-slate-900">Seguridad</Text>
        <Text className="mt-1 mb-3 text-sm text-slate-500">
          Mantén actualizada la contraseña de tu cuenta.
        </Text>
        <Button
          fullWidth
          variant="outline"
          className="mt-3"
          onPress={() => setIsPasswordModalVisible(true)}
        >
          Actualizar contraseña
        </Button>
        <Text className="mt-6 text-lg font-bold text-slate-900">Sesión</Text>
        <Text className="mt-1 mb-3 text-sm text-slate-500">
          Cierra tu sesión en este dispositivo.
        </Text>
        <Button
          variant="danger"
          className="self-start"
          onPress={() => setIsLogoutModalVisible(true)}
          disabled={isLoggingOut}
        >
          Cerrar sesión
        </Button>
      </View>

      <AppModal
        visible={isProfileModalVisible}
        title="Actualizar información"
        onRequestClose={() => setIsProfileModalVisible(false)}
      >
        <Controller
          control={profileControl}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nombre"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={profileErrors.firstName?.message}
            />
          )}
        />
        <Controller
          control={profileControl}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Apellido"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={profileErrors.lastName?.message}
            />
          )}
        />
        <Controller
          control={profileControl}
          name="phoneNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Teléfono"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={profileErrors.phoneNumber?.message}
            />
          )}
        />
        <Button
          fullWidth
          className="mt-2"
          onPress={() => void handleProfileSubmit(submitProfile)()}
          disabled={isProfileSubmitting || isUpdating}
        >
          {isUpdating ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </AppModal>

      <AppModal
        visible={isPasswordModalVisible}
        title="Actualizar contraseña"
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <Controller
          control={passwordControl}
          name="currentPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Contraseña actual"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={passwordErrors.currentPassword?.message}
            />
          )}
        />
        <Controller
          control={passwordControl}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nueva contraseña"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={passwordErrors.newPassword?.message}
            />
          )}
        />
        <Controller
          control={passwordControl}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirmar contraseña"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={passwordErrors.confirmPassword?.message}
            />
          )}
        />
        <Button
          fullWidth
          className="mt-2"
          onPress={() => void handlePasswordSubmit(submitPassword)()}
          disabled={isPasswordSubmitting || isChangingPassword}
        >
          {isChangingPassword ? 'Guardando...' : 'Cambiar contraseña'}
        </Button>
      </AppModal>

      <ConfirmationModal
        visible={isLogoutModalVisible}
        title="Cerrar sesión"
        message="¿Estás seguro de que deseas cerrar tu sesión?"
        confirmLabel="Cerrar sesión"
        confirmVariant="danger"
        isPending={isLoggingOut}
        onCancel={() => setIsLogoutModalVisible(false)}
        onConfirm={confirmLogout}
      />
    </View>
    </AuthScreen>
  );
}