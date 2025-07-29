import z from "zod";
import { onlyNumbers, validCPF } from "./basicFunctions";

export const alterarReferenciaSchema = z.object({
  cpf: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().length(11, { message: "CPF deve conter 11 dígitos." }))
    .refine((cpfValue) => validCPF(cpfValue), {
      message: "CPF inválido.", 
    }),
  departamento: z.string()
    .min(1, { message: "Departamento é obrigatório." }),
});
export type AlterarReferenciaSchemaType = z.infer<typeof alterarReferenciaSchema>;
