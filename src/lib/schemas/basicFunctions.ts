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