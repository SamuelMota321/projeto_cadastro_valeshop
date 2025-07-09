import { z } from 'zod';

const nameRegex = /^[a-zA-Z\u00C0-\u017F'\s]+$/;
const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

const onlyNumbers = (value: string) => value.replace(/\D/g, '');
const capitalizeName = (name: string) => {
  return name
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const userSchema = z.object({
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

  telefone: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().min(11, { message: "Telefone deve conter no mínimo 11 dígitos." })),

  email: z.string()
    .min(1)
    .transform(value => value.trim().toLowerCase())
    .pipe(z.string().email({ message: "Formato de e-mail inválido." })),

  nascimento: z.string()
    .min(1)
    .regex(dateRegex, { message: "Data deve estar no formato 1-31/1-12/AAAA." }),

  nomeMae: z.string()
    .min(1)
    .regex(nameRegex, { message: "Nome da mãe deve conter apenas letras e espaços." })
    .refine(value => value.trim().includes(' '), {
      message: "É necessário inserir o nome e sobrenome."
    })
    .transform(capitalizeName),
});

export type UserSchemaType = z.infer<typeof userSchema>;