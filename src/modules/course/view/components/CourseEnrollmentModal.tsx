import { ActivityIndicator, Text, View } from 'react-native';

import { AppModal, Button } from '@/src/modules/@core/view/components';

export function CourseEnrollmentModal({
  visible,
  isLoading,
  errorMessage,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  isLoading: boolean;
  errorMessage?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <AppModal
      visible={visible}
      title="Inscribirte al curso"
      onRequestClose={isLoading ? () => undefined : onClose}
    >
      <Text className="text-base leading-6 text-slate-600">
        ¿Deseas inscribirte en este curso para comenzar a aprender?
      </Text>
      {errorMessage ? (
        <Text className="mt-4 text-sm text-red-600">{errorMessage}</Text>
      ) : null}
      <View className="mt-6 flex-row gap-3">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          disabled={isLoading}
          onPress={onClose}
        >
          Cancelar
        </Button>
        <Button
          size="sm"
          className="flex-1"
          disabled={isLoading}
          onPress={onConfirm}
        >
          {isLoading ? 'Inscribiendo...' : 'Confirmar'}
        </Button>
      </View>
      {isLoading ? (
        <ActivityIndicator className="mt-4" size="small" color="#1039B8" />
      ) : null}
    </AppModal>
  );
}
