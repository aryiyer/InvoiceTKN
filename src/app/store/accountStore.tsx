import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

export type AccountInfo = {
    accountAddress: string,
    accountType: string,
}

//blueprint for the store type we want to create
type Store = {
    currentAccountInfo: AccountInfo | null;
    setAccountInfo: (info: AccountInfo) => void;
};

//Creation of the store object
export const useAccountStore = create<Store>()(
//use the create object of type Store, which calls a Function with the set function
//as a prop, this Function initializes selectedToken to null, and initializes the setSelectedToken function to take in a prop of Token, and use the set function prop to set
//the selectedToken prop to token.
    persist(
        (set, get) => ({
            currentAccountInfo: null,
            setAccountInfo: (info) => set({ currentAccountInfo: info}),
        }), {
            name: 'account-storage',
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
)