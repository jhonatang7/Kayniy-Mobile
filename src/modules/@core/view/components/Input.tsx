import {
  type ComponentRef,
  forwardRef,
  useState,
} from 'react';
import {
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

type InputFocusEvent = Parameters<
  NonNullable<TextInputProps['onFocus']>
>[0];

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export const Input = forwardRef<ComponentRef<typeof TextInput>, InputProps>(
  function Input(
  {
    label,
    error,
    containerClassName = '',
    labelClassName = '',
    inputClassName = '',
    onFocus,
    onBlur,
    ...props
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (event: InputFocusEvent) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: InputFocusEvent) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return (
    <View className={['w-full', containerClassName].filter(Boolean).join(' ')}>
      {label ? (
        <Text
          className={[
            'mb-2 text-sm font-medium text-slate-700',
            labelClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
        </Text>
      ) : null}
      <TextInput
        ref={ref}
        accessibilityLabel={props.accessibilityLabel ?? label}
        placeholderTextColor="#64748B"
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={[
          'min-h-12 rounded-xl border bg-white px-4 py-3 text-base text-slate-900',
          error
            ? 'border-red-500'
            : isFocused
              ? 'border-[#1039B8]'
              : 'border-slate-200',
          inputClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      <View className="min-h-5 pt-1">
        {error ? (
          <Text className="text-sm text-red-600">{error}</Text>
        ) : null}
      </View>
    </View>
  );
  }
);

Input.displayName = 'Input';
