import { z } from 'zod';

// Regex para validar nomes, permitindo letras (incluindo acentuadas) e espaços.
const nameRegex = /^[a-zA-Z\u00C0-\u017F'\s]+$/;
const phoneRegex = /^[0-9]+$/;
const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

// Esquema Zod com as mensagens de erro corretas em português
export const userSchema = z.object({
  cpf: z.string()
    .min(1, { message: "CPF é obrigatório." })
    .regex(/^[0-9]{11}$/, { message: "CPF deve conter exatamente 11 dígitos." }),
  
  nome: z.string()
    .min(1, { message: "Nome Completo é obrigatório." })
    .regex(nameRegex, { message: "Nome deve conter apenas letras e espaços." }),

  telefone: z.string()
    .min(1, { message: "Telefone é obrigatório." })
    .regex(phoneRegex, { message: "Telefone deve conter apenas números." }),

  email: z.string()
    .min(1, { message: "E-mail é obrigatório." })
    .email({ message: "Formato de e-mail inválido." }),

  nascimento: z.string()
    .min(1, { message: "Data de Nascimento é obrigatória." })
    .regex(dateRegex, { message: "Data deve estar no formato DD/MM/AAAA." }),
    
  nomeMae: z.string()
    .min(1, { message: "Nome da Mãe é obrigatório." })
    .regex(nameRegex, { message: "Nome da mãe deve conter apenas letras e espaços." }),
});

export type UserSchemaType = z.infer<typeof userSchema>;