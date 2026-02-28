import { create } from 'zustand';

export interface QuoteItem {
  id: string;
  name: string;
  image: string;
  category: string;
  origin: string;
  quantity: number;
  grade?: string;
  hsCode?: string;
  netWeight?: string;
  unitType?: string;
  packaging?: string;
  notes?: string; 
  fclUnits?: number; 
}

interface QuoteStore {
  items: QuoteItem[];
  addItem: (item: Omit<QuoteItem, 'quantity' | 'notes' | 'fclUnits' | 'packaging'>) => boolean;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  updateFCLUnits: (id: string, fclUnits: number) => void;
  updatePackaging: (id: string, packaging: string) => void; // New function
  clearItems: () => void;
}

export const useQuoteStore = create<QuoteStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    const exists = get().items.some((i) => i.id === item.id);
    if (exists) return false;

    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          quantity: 1,
          notes: '',
          fclUnits: 1,
          grade: 'Grade A',
          hsCode: 'PRE-ASSIGNED',
          netWeight: '28.5 MT',
          unitType: '20ft FCL',
          packaging: 'PP_BAGS', // Changed from 'PP BAGS' to match dropdown value
        },
      ],
    }));
    return true;
  },

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, Math.min(10, quantity)) } : i
      ),
    })),

  updateNotes: (id, notes) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, notes } : i)),
    })),

  updateFCLUnits: (id, fclUnits) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, fclUnits } : i)),
    })),

  // New function to update packaging
  updatePackaging: (id, packaging) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, packaging } : i)),
    })),

  clearItems: () => set({ items: [] }),
}));