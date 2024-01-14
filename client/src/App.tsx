import { ChakraProvider } from '@chakra-ui/react'
import { TransactionTable, UploadFile } from './components'

function App() {
  return (
    <ChakraProvider>
      <UploadFile />
      <TransactionTable />
    </ChakraProvider>
  )
}

export default App;