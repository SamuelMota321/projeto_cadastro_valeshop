import z from "zod";
import { onlyNumbers, validCPF } from "./basicFunctions";

export const newCardNewUser = z.object({
  cpf: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().length(11, { message: "CPF deve conter 11 dígitos." }))
    .refine((cpfValue) => validCPF(cpfValue), {
      message: "CPF inválido.",
    }),
  matricula: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().length(11, { message: "Matrícula deve conter 11 dígitos." })),

  departamento: z.string().optional(),
});
export type NewCardNewUserType = z.infer<typeof newCardNewUser>;