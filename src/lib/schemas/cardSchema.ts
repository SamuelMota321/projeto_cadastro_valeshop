import z from "zod";
import { capitalizeName, nameRegex, onlyNumbers } from "./basicFunctions";

const onlyNumbersCredit = (value: string) => value.replace(/[^\d.,]/g, '');
export const cardSchema = z.object({
  cpf: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().length(11, { message: "CPF deve conter 11 dígitos." })),
  nome: z.string()
    .min(1)
    .regex(nameRegex, { message: "Nome deve conter apenas letras e espaços." })
    .refine(value => value.trim().includes(' '), {
      message: "É necessário inserir o nome e sobrenome."
    })
    .transform(capitalizeName),
  valorCredito: z.string()
  .min(1)
  .transform(onlyNumbersCredit)
  .refine(value => {
    const num = Number(value.replace(/,/g, '.'));
    return num > 0;
  }, { message: "Valor de crédito deve ser positivo." })
  .transform(value => {
    const num = Number(value.replace(/,/g, '.'));
    if (isNaN(num)) return "0,00";
    return num.toFixed(2).replace('.', ',');
  }),
  departamento: z.string().optional(),
});
export type CardSchemaType = z.infer<typeof cardSchema>;