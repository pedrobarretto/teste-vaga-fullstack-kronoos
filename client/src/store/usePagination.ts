import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface PaginationState {
  search: string;
  hasNextPage: boolean;
  page: number;
  setSearch: (search: string) => void;
  setHasNextPage: (hnp: boolean) => void;
  setPage: (page: number) => void;
}

export const usePagination = create<PaginationState>()(
  devtools(
    persist(
      (set) => ({
        search: '',
        hasNextPage: false,
        page: 1,
        setSearch: (search) => set(() => ({ search: search })),
        setHasNextPage: (hnp) => set(() => ({ hasNextPage: hnp })),
        setPage: (page) => set(() => ({ page: page })),
      }),
      {
        name: 'pagination-store',
      },
    ),
  ),
)