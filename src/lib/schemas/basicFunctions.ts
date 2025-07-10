export const nameRegex = /^[a-zA-Z\u00C0-\u017F'\s]+$/;
export const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
export const movimentacaoRegex = /^(Ativar|Cancelar|Inativar|Bloquear)$/i;
export const onlyNumbers = (value: string) => value.replace(/\D/g, '');
export const capitalizeName = (name: string) => {
  return name
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};