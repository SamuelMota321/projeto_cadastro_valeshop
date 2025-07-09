import { z } from 'zod';

export const companySchema = z.object({
  numeroContrato: z.string().min(1, { message: "N° do contrato é obrigatório." }),
});

export type CompanySchemaType = z.infer<typeof companySchema>;