import z from "zod";
import { capitalizeName, nameRegex } from "./basicFunctions";

export const newReferenceSchema = z.object({
  departamento: z.string()
    .min(1, { message: "Campo obrigatório." })
    .regex(nameRegex, { message: "Nome do departamento deve conter apenas letras e espaços." })
    .transform(capitalizeName),
});
export type newReferenceSchemaType = z.infer<typeof newReferenceSchema>;