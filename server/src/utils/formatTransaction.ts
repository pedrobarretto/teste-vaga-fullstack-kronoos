import { Transaction } from "../interfaces";

export const formatTransactionValues = (transaction: Transaction): Transaction => {
  const formatNumberToBRL = (value: string): string => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(value));
  };

  const formatDate = (dateString: string): Date => {
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1;
    const day = parseInt(dateString.substring(6, 8), 10);

    return new Date(year, month, day);
  };

  return {
    ...transaction,
    vlTotal: formatNumberToBRL(transaction.vlTotal),
    vlPresta: formatNumberToBRL(transaction.vlPresta),
    vlMora: formatNumberToBRL(transaction.vlMora),
    vlMulta: formatNumberToBRL(transaction.vlMulta),
    vlOutAcr: formatNumberToBRL(transaction.vlOutAcr),
    vlIof: formatNumberToBRL(transaction.vlIof),
    vlDescon: formatNumberToBRL(transaction.vlDescon),
    vlAtual: formatNumberToBRL(transaction.vlAtual),
    dtContrato: formatDate(String(transaction.dtContrato)),
    dtVctPre: formatDate(String(transaction.dtVctPre)),
  };
};