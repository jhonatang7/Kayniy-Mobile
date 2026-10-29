import { z } from 'zod';

export const firstLoginPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
    confirmPassword: z.string().min(6, 'Confirma tu contraseña.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export type FirstLoginPasswordFormData = z.infer<typeof firstLoginPasswordSchema>;