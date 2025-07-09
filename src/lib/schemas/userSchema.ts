import { z } from 'zod';

// Regex para validações
const nameRegex = /^[a-zA-Z\u00C0-\u017F'\s]+$/;
const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
const phoneCPFRegex = /^[0-9]{11}$/;

export const userSchema = z.object({
  cpf: z.string()
    .min(1)
    .regex(phoneCPFRegex, { message: "CPF deve conter exatamente 11 dígitos." }),

  nome: z.string()
    .min(1)
    .regex(nameRegex, { message: "Nome deve conter apenas letras e espaços." }),

  telefone: z.string()
    .min(1)
    .regex(phoneCPFRegex, { message: "Telefone deve conter exatamente 11 dígitos." }),

  email: z.string()
    .min(1)
    .email({ message: "Formato de e-mail inválido." }),

  nascimento: z.string()
    .min(1)
    .regex(dateRegex, { message: "Data deve estar no formato DD/MM/AAAA." }),
    
  nomeMae: z.string()
    .min(1)
    .regex(nameRegex, { message: "Nome da mãe deve conter apenas letras e espaços." }),
});

export type UserSchemaType = z.infer<typeof userSchema>;