import { Transaction } from '../interfaces';

export const validatePayment = (transaction: Transaction): boolean => {
  const { vlTotal, qtPrestacoes, vlPresta, vlMora, vlDescon } = transaction;
  const monthlyPayment = parseInt(vlTotal) / parseInt(qtPrestacoes);

  if (
    parseInt(vlMora) > (parseInt(vlTotal) - parseInt(vlDescon)) ||
    monthlyPayment !== parseInt(vlPresta)
    ) return false;

  return true;
};
