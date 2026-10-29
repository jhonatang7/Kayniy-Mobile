import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, 'Pega el token que recibiste por correo.'),
    newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
    confirmPassword: z.string().min(6, 'Confirma tu contraseña.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;