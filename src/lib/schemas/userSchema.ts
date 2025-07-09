import { z } from 'zod';

const nameRegex = /^[a-zA-Z\u00C0-\u017F'\s]+$/;
const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

const onlyNumbers = (value: string) => value.replace(/\D/g, '');

export const userSchema = z.object({
  cpf: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().length(11, { message: "CPF deve conter 11 dígitos." })),

  nome: z.string()
    .min(1, { message: "Nome Completo é obrigatório." })
    .regex(nameRegex, { message: "Nome deve conter apenas letras e espaços." })
    .refine(value => value.trim().includes(' '), {
      message: "É necessário inserir o nome e sobrenome."
    }),

  telefone: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().min(10, { message: "Telefone deve conter no mínimo 10 dígitos." })),

  email: z.string()
    .min(1, { message: "E-mail é obrigatório." })
    .email({ message: "Formato de e-mail inválido." }),

  nascimento: z.string()
    .min(1, { message: "Data de Nascimento é obrigatória." })
    .regex(dateRegex, { message: "Data deve estar no formato DD/MM/AAAA." }),

  nomeMae: z.string()
    .min(1, { message: "Nome da Mãe é obrigatório." })
    .regex(nameRegex, { message: "Nome da mãe deve conter apenas letras e espaços." })
    .refine(value => value.trim().includes(' '), {
      message: "É necessário inserir o nome e sobrenome."
    }),
});

export type UserSchemaType = z.infer<typeof userSchema>;