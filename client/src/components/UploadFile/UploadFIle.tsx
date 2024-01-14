/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Button, Input, Stack } from '@chakra-ui/react';
import { useTransactions } from '../../store';

export function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const { setTransactions } = useTransactions();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    setFile(selectedFile || null);
  };

  // const getData = async () => {
  //   try {
  //     const response = await fetch('http://localhost:8080/data/1', { method: 'GET' });

  //     if (!response.ok) {
  //       throw new Error(`Erro na solicitação: ${response.status}`);
  //     }

  //     const responseBody = await response.json();
  //     setTransactions(responseBody.transactions);
  //   } catch (error) {
  //     console.error('Erro durante a solicitação:', error);
  //   }
  // };

  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/data/search/${searchValue}`, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`Erro na solicitação: ${response.status}`);
      }

      const responseBody = await response.json();
      setTransactions(responseBody.transactions);
    } catch (error) {
      console.error('Erro durante a solicitação:', error);
    }
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        console.error('Nenhum arquivo selecionado.');
        return;
      }

      const formData = new FormData();
      formData.append('csv', file);

      const response = await fetch('http://localhost:8080/data/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseBody = await response.json();
        setTransactions(responseBody.transactions);
      } else {
        console.error('Falha no upload.');
      }
    } catch (error) {
      console.error('Erro durante o upload:', error);
    }
  };

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      alignItems={'center'}
      justifyContent={'space-between'}
      p={4}
      bg="#036D41"
      color="#fff"
      spacing={2}
      width={{ base: '100%', md: '100%' }}
      mx="auto"
    >
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        color="#fff"
        width={{ base: '100%', md: 'auto' }}
        marginBottom={{ base: '2', md: '0' }}
      />
      <Input
        placeholder="Pesquisar..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        color="#fff"
        width={{ base: '100%', md: 'auto' }}
        marginBottom={{ base: '2', md: '0' }}
      />
      <Button onClick={handleUpload} isDisabled={!file} bg="#000" color="#fff">
        Enviar Arquivo
      </Button>
      <Button onClick={getData} isDisabled={searchValue === ''} bg="#000" color="#fff">
        Atualizar Tabela
      </Button>
    </Stack>
  );
}
