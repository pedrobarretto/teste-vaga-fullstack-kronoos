import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Transaction } from '../interfaces'

interface TransactionState {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
}

export const useTransactions = create<TransactionState>()(
  devtools(
    persist(
      (set) => ({
        transactions: [],
        setTransactions: (newT) => set(() => ({ transactions: newT })),
      }),
      {
        name: 'transactions-store',
      },
    ),
  ),
)