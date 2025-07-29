import z from "zod";
import { capitalizeName, dateRegex, nameRegex, onlyNumbers, validCPF } from "./basicFunctions";

const cnhRegex = /^(ACC|A|B|C|D|E)$/i;

export const driverSchema = z.object({
  matricula: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().length(11, { message: "A matrícula deve conter 11 dígitos." })),
  nome: z.string()
    .min(1)
    .regex(nameRegex, { message: "Nome deve conter apenas letras e espaços." })
    .refine(value => value.trim().includes(' '), {
      message: "É necessário inserir o nome e sobrenome."
    })
    .transform(capitalizeName),
  cpf: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().length(11, { message: "CPF deve conter 11 dígitos." }))
    .refine((cpfValue) => validCPF(cpfValue), {
      message: "CPF inválido.",
    }),
  validadeCnh: z.string()
    .min(1)
    .regex(dateRegex, { message: "Data deve estar no formato 1-31/1-12/AAAA." }),
  numeroCnh: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().length(11, { message: "O número da CNH deve conter 11 dígitos." })),
  categoriaCnh: z.string()
    .min(1, { message: "Tipo de CNH é obrigatório." })
    .regex(cnhRegex, { message: "Tipo de CNH deve ser: ACC, A, B, C, D ou E." })
    .transform(capitalizeName),
});
export type driverSchemaType = z.infer<typeof driverSchema>;