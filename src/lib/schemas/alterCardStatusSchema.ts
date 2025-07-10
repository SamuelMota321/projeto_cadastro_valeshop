import z from "zod";
import { capitalizeName, nameRegex, onlyNumbers } from "./basicFunctions";

const movimentacaoRegex = /^(Ativar|Cancelar|Inativar|Bloquear)$/i;

export const alterCardStatusSchema = z.object({
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
  movimentacao: z.string()
    .min(1, { message: "Tipo de movimentação é obrigatório." })
    .regex(movimentacaoRegex, { message: "Movimentação deve ser: Ativar, Cancelar, Inativar ou Bloquear." })
    .transform(capitalizeName),
});
export type alterCardStatusSchemaType = z.infer<typeof alterCardStatusSchema>;
