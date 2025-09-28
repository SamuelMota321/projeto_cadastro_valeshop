export const nameRegex = /^[a-zA-Z\u00C0-\u017F'\s]+$/;
export const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
export const onlyNumbers = (value: string) => value.replace(/\D/g, '');
export const onlyNumbersCredit = (value: string) => value.replace(/[^\d.,]/g, '').replace(/\s/g, '');
export const capitalizeName = (name: string) => {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const validCPF = (cpf: string): boolean => {
cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false; // Verifica tamanho e sequências repetidas

  let sum = 0;
  let rest;

  // Validação do primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  // Validação do segundo dígito verificador
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}