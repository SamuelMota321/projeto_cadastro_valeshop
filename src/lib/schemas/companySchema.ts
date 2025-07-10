import { z } from 'zod';
import { onlyNumbers } from './basicFunctions';

export const companySchema = z.object({
  numeroContrato: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().length(14, { message: "N° do contrato deve ter 14 dígitos." })),
});

export type CompanySchemaType = z.infer<typeof companySchema>;