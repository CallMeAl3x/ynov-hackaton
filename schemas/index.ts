import { TwoFactorMethod, UserRole, CharacterRole } from "@prisma/client";
import * as z from "zod";

// Story Creation Schemas
export const StoryBasicSchema = z.object({
  name: z.string().min(1, {
    message: "Story title is required"
  }).max(200, {
    message: "Story title must be less than 200 characters"
  }),
  theme: z.string().min(1, {
    message: "Story theme is required"
  }),
  subject: z.string().min(10, {
    message: "Story subject must be at least 10 characters"
  }).max(5000, {
    message: "Story subject must be less than 5000 characters"
  }),
  description: z.optional(z.string().max(1000)).default("")
});

export const CharacterCreateSchema = z.object({
  name: z.string().min(1, {
    message: "Character name is required"
  }),
  description: z.string().min(10, {
    message: "Character description must be at least 10 characters"
  }),
  role: z.enum([CharacterRole.PROTAGONIST, CharacterRole.ANTAGONIST, CharacterRole.SECONDARY, CharacterRole.MINOR])
});

export const AIStoryGenerationSchema = z.object({
  subject: z.string().min(10, {
    message: "Please provide at least 10 characters describing your story idea"
  }).max(2000, {
    message: "Subject must be less than 2000 characters"
  })
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
  password: z.string().min(1, {
    message: "Password is required"
  }),
  code: z.optional(z.string())
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address"
  })
});

export const NewPasswordchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required"
  })
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required"
  }),
  name: z.string().min(1, {
    message: "Name is required"
  })
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
    TwoFactorMethod: z.optional(z.enum([TwoFactorMethod.EMAIL, TwoFactorMethod.OTP])),
    code: z.optional(z.string())
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "New Password is required",
      path: ["newPassword"]
    }
  );
