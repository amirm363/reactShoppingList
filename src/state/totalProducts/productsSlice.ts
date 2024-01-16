import { createSlice, PayloadAction, createNextState } from '@reduxjs/toolkit';
import { ChosenProducts } from '../../utils/types';

interface Products {
    id: string;
    count: { [key: string]: number };
}

interface ProductsState {
    totalProducts: number;
    inCartProducts: { [category: string]: { [product: string]: number } }
}

const initialState: ProductsState = {
    totalProducts: 0,
    inCartProducts: {}
};

// Creating a slice of the Redux store for products
const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        // Reducer to sum up the total number of products
        sumProducts: (state, action: PayloadAction<ChosenProducts>) => {
            // Calculating the total number of products
            const total = Object.values(action.payload).reduce((sum, category) => {
                return sum + Object.values(category).reduce((a, b) => (a as number) + (b as number), 0);
            }, 0);
            // Updating the totalProducts state with the calculated total
            state.totalProducts = total;
        },
        // Reducer to add products to the cart
        addToCart: (state, action: PayloadAction<ChosenProducts>) => {
            // Updating the inCartProducts state with the new value from the action payload
            state.inCartProducts = createNextState(state.inCartProducts, () => {
                return action.payload;
            });
        }
    },
});

export const { sumProducts, addToCart } = productsSlice.actions;

export default productsSlice.reducer;
