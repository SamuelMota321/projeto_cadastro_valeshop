import z from "zod";
import { capitalizeName, nameRegex, onlyNumbers } from "./basicFunctions";

export const newReferenceSchema = z.object({
  cpf: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().length(11, { message: "CPF deve conter 11 dígitos." })),
  departamento: z.string()
    .min(1, { message: "Campo obrigatório." })
    .regex(nameRegex, { message: "Nome do departamento deve conter apenas letras e espaços." })
    .transform(capitalizeName),
});
export type newReferenceSchemaType = z.infer<typeof newReferenceSchema>;