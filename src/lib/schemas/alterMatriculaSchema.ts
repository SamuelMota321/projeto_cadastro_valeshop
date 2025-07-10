import { z } from "zod";
import { onlyNumbers } from "./basicFunctions";

export const alterMatriculaSchema = z.object({
  matriculaAntiga: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().length(11, { message: "A matrícula deve conter 11 dígitos." })),
  matriculaNova: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().length(11, { message: "A matrícula deve conter 11 dígitos." })),
});
export type AlterMatriculaSchemaType = z.infer<typeof alterMatriculaSchema>;