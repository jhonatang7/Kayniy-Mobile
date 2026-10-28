import { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

export interface CardProps extends ViewProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}

export function Card({
  children,
  className = '',
  elevated = true,
  ...props
}: CardProps) {
  return (
    <View
      {...props}
      className={[
        'rounded-2xl border border-slate-100 bg-white p-4',
        elevated ? 'shadow-sm' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </View>
  );
}
