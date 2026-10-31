import { Modal, Pressable, Text, View } from 'react-native';

export interface CourseFilterOption {
  value: string;
  label: string;
}

interface CourseFilterModalProps {
  visible: boolean;
  title: string;
  options: CourseFilterOption[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function CourseFilterModal({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: CourseFilterModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/30" onPress={onClose}>
        <Pressable className="rounded-t-3xl bg-white px-6 pb-10 pt-5" onPress={() => undefined}>
          <View className="mb-5 h-1 w-10 self-center rounded-full bg-slate-200" />
          <Text className="text-lg font-bold text-slate-900">{title}</Text>
          <View className="mt-4">
            {options.map((option) => (
              <Pressable
                key={option.value}
                className="flex-row items-center justify-between border-b border-slate-100 py-4"
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text className="text-base text-slate-700">{option.label}</Text>
                {selected === option.value ? (
                  <Text className="font-bold text-[#1039B8]">✓</Text>
                ) : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
