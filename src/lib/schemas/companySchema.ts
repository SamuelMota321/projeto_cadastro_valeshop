import { z } from 'zod';

const NContrato = /^[0-9]{14}$/;


export const companySchema = z.object({
  numeroContrato: z.string().min(1).regex(NContrato, { message: "N° do contrato deve conter exatamente 14 dígitos." }),
});

export type CompanySchemaType = z.infer<typeof companySchema>;