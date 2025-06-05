import { z } from 'zod';

export const UserValidate = z.object({
    full_name: z.string().min(1, 'Full name required').trim(),
    email: z.string().email('Invalid email').toLowerCase(),
    password: z.string().min(6, 'Password too short'),
    is_active: z.boolean().optional(),
});