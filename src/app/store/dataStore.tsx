import {create} from 'zustand';

export type TokenData2 = {
    tokenId: number,
    yield: number,
    mintedDate: number,
    minter: string,
    valid: boolean,
    name: string,
    value: number, //value in WEI!!!
    customer: string,
    port: string,
    vesselName: string,
    bunkerQuantity: number,
    bunkerPrice: number,
    maturityDate: number,        
}


//blueprint for the store type we want to create
type Store = {
    selectedToken: TokenData2 | null; //store will have a variable selectedToken of type TokenData or null
    setSelectedToken: (token: TokenData2) => void; //store will have a function setSelectedToken which will take a TokenData as a prop;
};

//Creation of the store object
export const useTokenStore = create<Store>((set) => ({
//use the create object of type Store, which calls a Function with the set function
//as a prop, this Function initializes selectedToken to null, and initializes the setSelectedToken function to take in a prop of Token, and use the set function prop to set
//the selectedToken prop to token.
    selectedToken: null,
    setSelectedToken: (token) => set({ selectedToken: token}),
}))