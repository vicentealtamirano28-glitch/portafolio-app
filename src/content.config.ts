import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lecciones = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/lecciones' }),
  schema: z
    .object({
      orden: z.number().int().positive(),
      titulo: z.string(),
      resumen: z.string(),
      minutos: z.number().positive(),
      quiz: z
        .array(
          z.object({
            pregunta: z.string(),
            opciones: z.array(z.string()).min(2),
            correcta: z.number().int().nonnegative(),
            explicacion: z.string(),
          }),
        )
        .min(2)
        .max(3),
      faq: z.array(z.object({ pregunta: z.string(), respuesta: z.string() })).length(2),
    })
    .refine((d) => d.quiz.every((q) => q.correcta < q.opciones.length), {
      message: 'quiz.correcta debe ser un índice válido de opciones',
    }),
});

export const collections = { lecciones };
