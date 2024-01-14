import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Box,
  Button,
  Text
} from '@chakra-ui/react';
import { Transaction } from '../../interfaces';
import { usePagination, useTransactions } from '../../store';

export function TransactionTable() {
  const { transactions, setTransactions } = useTransactions();
  const { page, setPage, hasNextPage, setHasNextPage } = usePagination();

  const handleNextPage = async () => {
    const prev = page;
    setPage(prev + 1);
    const response = await fetch(`http://localhost:8080/data/${prev + 1}`, { method: 'GET' });
    const responseBody = await response.json();
    setTransactions(responseBody.transactions);
    setHasNextPage(responseBody.hasNextPage);
  };

  const handlePrevPage = async () => {
    const prev = page;
    setPage(Math.max(prev - 1, 1));
    const response = await fetch(`http://localhost:8080/data/${prev - 1}`, { method: 'GET' });
    const responseBody = await response.json();
    setTransactions(responseBody.transactions);
    setHasNextPage(responseBody.hasNextPage);
  };

  const handleColor = (transaction: Transaction) => {
    if (transaction.isDocumentValid) return 'green';
    return transaction.isPaymentOk === false ? 'red' : '#000';
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <TableCaption>Lista de Transações</TableCaption>
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>nrInst</Th>
            <Th>nrAgencia</Th>
            <Th>cdClient</Th>
            <Th>nmClient</Th>
            <Th>nrCpfCnpj</Th>
            <Th>nrContrato</Th>
            <Th>dtContrato</Th>
            <Th>qtPrestacoes</Th>
            <Th>vlTotal</Th>
            <Th>cdProduto</Th>
            <Th>dsProduto</Th>
            <Th>cdCarteira</Th>
            <Th>dsCarteira</Th>
            <Th>nrProposta</Th>
            <Th>nrPresta</Th>
            <Th>tpPresta</Th>
            <Th>nrSeqPre</Th>
            <Th>dtVctPre</Th>
            <Th>vlPresta</Th>
            <Th>vlMora</Th>
            <Th>vlMulta</Th>
            <Th>vlOutAcr</Th>
            <Th>vlIof</Th>
            <Th>vlDescon</Th>
            <Th>vlAtual</Th>
            <Th>idSituac</Th>
            <Th>idSitVen</Th>
            <Th>isDocumentValid</Th>
            <Th>isPaymentOk</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Tr key={transaction._id?.toString()}>
              {Object.values(transaction).map((value, index) => {
                return (
                  <Td
                    key={index}
                    style={{ color: handleColor(transaction) }}>
                    {value instanceof Date ? value.toDateString() : String(value)}
                  </Td>
                )
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button onClick={handlePrevPage} isDisabled={page === 1}>
          Página Anterior
        </Button>
        <Text>
          Página {page}
        </Text>
        <Button onClick={handleNextPage} isDisabled={!hasNextPage}>
          Próxima Página
        </Button>
      </Box>
    </Box>
  );
}
