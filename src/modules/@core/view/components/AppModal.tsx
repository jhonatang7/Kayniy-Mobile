import type { ReactNode } from 'react';
import { Modal, Text, View } from 'react-native';

export function AppModal({
  visible,
  title,
  children,
  onRequestClose,
}: {
  visible: boolean;
  title: string;
  children: ReactNode;
  onRequestClose: () => void;
}) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-full max-w-sm rounded-2xl bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">{title}</Text>
          <View className="mt-5">{children}</View>
        </View>
      </View>
    </Modal>
  );
}