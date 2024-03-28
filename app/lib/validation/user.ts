import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string(),
  email: z.string().email(),
});

export const UserSearchSchema = UserSchema.omit({ id: true }).and(
  z.object({ userId: z.number() })
);
