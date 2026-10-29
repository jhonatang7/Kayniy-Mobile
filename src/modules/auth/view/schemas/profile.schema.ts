import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(2, 'Ingresa tu nombre.'),
  lastName: z.string().min(2, 'Ingresa tu apellido.'),
  phoneNumber: z.string().min(7, 'Ingresa un número válido.'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;