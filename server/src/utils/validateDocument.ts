import { cnpj, cpf } from 'cpf-cnpj-validator';

export const validateDocument = (nrCpfCnpj: string): boolean => {
  const cleanedNrCpfCnpj = nrCpfCnpj.replace(/\D/g, '');

  if (cleanedNrCpfCnpj.length === 11) return cpf.isValid(cleanedNrCpfCnpj);
  if (cleanedNrCpfCnpj.length === 14) return cnpj.isValid(cleanedNrCpfCnpj);

  return false;
};