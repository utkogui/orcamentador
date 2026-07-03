import { Complexity } from "@prisma/client";
import { z } from "zod";

export const estimateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  clientName: z.string().optional(),
  description: z.string().optional(),
  marginPct: z.coerce.number().min(0).max(100),
});

export const moduleSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
});

export const disciplineSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  hourlyRate: z.coerce.number().positive("Valor/hora deve ser positivo"),
  description: z.string().optional(),
});

export const moduleHourSchema = z.object({
  disciplineId: z.string().min(1),
  baseHours: z.coerce.number().min(0),
});

export const estimateModuleSchema = z.object({
  moduleId: z.string().min(1),
  complexity: z.nativeEnum(Complexity),
  quantity: z.coerce.number().int().min(1),
});

export const multiplierSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  factor: z.coerce.number().positive(),
  target: z.enum(["HOURS", "COST"]),
});

export type EstimateFormData = z.infer<typeof estimateSchema>;
export type ModuleFormData = z.infer<typeof moduleSchema>;
export type DisciplineFormData = z.infer<typeof disciplineSchema>;
