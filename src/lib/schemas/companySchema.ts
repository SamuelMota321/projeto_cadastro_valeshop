import { z } from 'zod';

const contractregex = (value: string) =>  value.replace(/\-/g, '_');  

export const companySchema = z.object({
  numeroContrato: z.string()
    .transform(contractregex)
    .pipe(z.string().length(18, { message: "N° do contrato deve ter 14 dígitos." })),
});

export type CompanySchemaType = z.infer<typeof companySchema>;