import {create} from 'zustand';

export type TokenData = {
    tokenId: number,
    info: string,
    value: number,
    yield: number,
    ownerHistory: string[],
    valid: boolean,
    listed: boolean,
    minter: string,
    approved: string,
    maturityDate: number,
};

export type AccountInfo = {
    accountAddress: string,
    accountType: string,
}

//blueprint for the store type we want to create
type Store = {
    selectedToken: TokenData | null; //store will have a variable selectedToken of type TokenData or null
    setSelectedToken: (token: TokenData) => void; //store will have a function setSelectedToken which will take a TokenData as a prop;

    currentAccountInfo: AccountInfo | null;
    setAccountInfo: (info: AccountInfo) => void;

};

//Creation of the store object
export const useTokenStore = create<Store>((set) => ({
//use the create object of type Store, which calls a Function with the set function
//as a prop, this Function initializes selectedToken to null, and initializes the setSelectedToken function to take in a prop of Token, and use the set function prop to set
//the selectedToken prop to token.
    selectedToken: null,
    setSelectedToken: (token) => set({ selectedToken: token}),

    currentAccountInfo: null,
    setAccountInfo: (info) => set({ currentAccountInfo: info}),
}))