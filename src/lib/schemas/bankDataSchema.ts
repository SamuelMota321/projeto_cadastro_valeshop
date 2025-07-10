import z from "zod";

export const bankDataSchema = z.object({
  banco: z.string()
    .min(3, { message: "Banco deve conter 3 dígitos." }),
  agencia: z.string()
    .min(4, { message: "Agência deve conter 4 dígitos." }),
  digitoAgencia: z.string()
    .min(1, { message: "Dígito da agência deve conter 1 dígito." }),
  conta: z.string()
    .min(9, { message: "Conta deve conter 9 dígitos." }),
  digitoConta: z.string()
    .min(1, { message: "Dígito da conta deve conter 1 dígito." }),
});
export type BankDataSchemaType = z.infer<typeof bankDataSchema>;