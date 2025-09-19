import { z } from 'zod'

export const reportSchema = z.object({
  fullName: z.string().optional(),
  category: z.enum(['Discriminación', 'Corrupción', 'Inconformidades', 'Sugerencias']),
  area: z.string().min(1, 'El área es requerida'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  file: z.instanceof(File).optional()
})

export type ReportData = z.infer<typeof reportSchema>