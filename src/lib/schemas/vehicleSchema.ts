import z from "zod";
import { onlyNumbers } from "./basicFunctions";

const placaRegex = /^([A-Z]{3}\d{4}|[A-Z]{3}\d{1}[A-Z]{1}\d{2})$/i;
const chassiRegex = /^\d{1}[A-Z]{2}[A-Z\d]{8}\d{6}$/i;

export const vehicleSchema = z.object({
  renavam: z.string()
    .transform(onlyNumbers)
    .pipe(z.string().length(11, { message: "Renavam deve conter 11 dígitos." })),
  placa: z.string()
    .min(1, { message: "Campo obrigatório." })
    .regex(placaRegex, { message: "Placa deve estar no formato LLL-NNNN ou LLLNLNN." })
    .transform(value => value.toUpperCase()),
  chassi: z.string()
    .min(17, { message: "Chassi deve conter 17 caracteres." })
    .regex(chassiRegex, { message: "Chassi deve seguir o seguinte formato: 1 Número, 9 Letras ou números e 6 Números." })
    .transform(value => value.toUpperCase()),
  anoFabricacao: z.string()
    .min(4, { message: "Ano de fabricação deve conter 4 dígitos." })
    .transform(onlyNumbers),
  modeloId: z.string()
    .min(3, { message: "ID do Modelo deve conter 3 dígitos." })
    .transform(onlyNumbers)
});
export type VehicleSchemaType = z.infer<typeof vehicleSchema>;
