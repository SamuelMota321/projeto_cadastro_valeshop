import { z } from 'zod';
// import { onlyNumbers } from './basicFunctions';

const textRegex =  (value: string) => value.replace(/\-/g, '_');
export const companySchema = z.object({
  numeroContrato: z.string()
    .transform(textRegex)
    .pipe(z.string().length(18, { message: "N° do contrato deve ter 14 dígitos." })),
});

export type CompanySchemaType = z.infer<typeof companySchema>;