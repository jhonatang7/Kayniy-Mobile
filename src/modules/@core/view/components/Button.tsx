import { type ReactNode } from 'react';
import {
  Pressable,
  type PressableProps,
  Text,
  type TextStyle,
} from 'react-native';

const buttonVariants = {
  primary: {
    container: 'bg-[#1039B8]',
    label: 'text-white',
  },
  secondary: {
    container: 'bg-slate-100',
    label: 'text-slate-900',
  },
  outline: {
    container: 'border border-[#1039B8] bg-transparent',
    label: 'text-[#1039B8]',
  },
  ghost: {
    container: 'bg-transparent',
    label: 'text-[#1039B8]',
  },
  danger: {
    container: 'bg-red-600',
    label: 'text-white',
  },
} as const;

const buttonSizes = {
  sm: {
    container: 'min-h-10 rounded-xl px-4',
    label: 'text-sm',
  },
  md: {
    container: 'min-h-12 rounded-xl px-5',
    label: 'text-base',
  },
  lg: {
    container: 'min-h-14 rounded-2xl px-6',
    label: 'text-lg',
  },
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

export interface ButtonProps
  extends Omit<PressableProps, 'children' | 'style'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  labelClassName?: string;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  labelClassName = '',
  textStyle,
  fullWidth = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const variantStyles = buttonVariants[variant];
  const sizeStyles = buttonSizes[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      className={[
        'flex-row items-center justify-center shadow-sm',
        sizeStyles.container,
        variantStyles.container,
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-50' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {({ pressed }) => (
        <Text
          className={[
            'font-semibold',
            sizeStyles.label,
            variantStyles.label,
            pressed && !disabled ? 'opacity-70' : '',
            labelClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          style={textStyle}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}
