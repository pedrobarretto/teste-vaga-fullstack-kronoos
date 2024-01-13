/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    setFile(selectedFile || null);
  };

  const getData = async () => {
    const response = await fetch('http://localhost:8080/data', { method: 'GET' });
    console.log(response.body);
  }

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
        console.log('Upload bem-sucedido!');
      } else {
        console.error('Falha no upload.');
      }
    } catch (error) {
      console.error('Erro durante o upload:', error);
    }
  };

  return (
    <div>
      <h2>Upload de CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Fazer Upload
      </button>
      <button onClick={getData}>
        Get Data
      </button>
    </div>
  );
}

export default App;
