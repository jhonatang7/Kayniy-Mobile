import { Text } from 'react-native';

import { AppModal } from './AppModal';
import { Button } from './Button';

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmLabel,
  confirmVariant = 'primary',
  isPending = false,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant?: 'primary' | 'danger';
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AppModal visible={visible} title={title} onRequestClose={onCancel}>
      <Text className="text-base leading-6 text-slate-600">{message}</Text>
      <Button
        fullWidth
        variant="outline"
        className="mt-6"
        onPress={onCancel}
        disabled={isPending}
      >
        Cancelar
      </Button>
      <Button
        fullWidth
        variant={confirmVariant}
        className="mt-3"
        onPress={onConfirm}
        disabled={isPending}
      >
        {isPending ? 'Procesando...' : confirmLabel}
      </Button>
    </AppModal>
  );
}