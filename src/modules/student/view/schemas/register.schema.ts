import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Ingresa tu nombre.'),
  lastName: z.string().min(2, 'Ingresa tu apellido.'),
  email: z.string().email('Ingresa un email válido.'),
  phoneNumber: z.string().min(7, 'Ingresa un número válido.'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
