import { z } from "zod";

export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(20),
});

export const ttsRequestSchema = z.object({
  text: z.string().min(1).max(500),
  voiceId: z.string().optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is too short").max(80),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message is too short").max(2000),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type TtsRequest = z.infer<typeof ttsRequestSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;