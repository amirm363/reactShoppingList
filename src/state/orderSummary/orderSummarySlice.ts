import { createSlice, PayloadAction, createNextState } from '@reduxjs/toolkit';
import { ChosenProducts } from '../../utils/types';



interface Products {
    chosenProducts: ChosenProducts;
}
// Defining the initial state of the Products
const initialState: Products = {
    chosenProducts: {} as ChosenProducts
};

// Creating a slice of the Redux store for chosen products
const chosenProductsSlice = createSlice({
    name: 'chosenProducts',
    initialState,
    reducers: {
        // Reducer to gather products
        gatherProducts: (state, action: PayloadAction<Products>) => {
            // Updating the chosenProducts state with the new value from the action payload
            state.chosenProducts = createNextState(state.chosenProducts, () => {
                return action.payload;
            });
        },
        // Reducer to update the count of a product
        updateProductCount: (state, action: PayloadAction<{ categoryName: string, product: string, count: number }>) => {
            const { categoryName, product, count } = action.payload;
            // If the count is 0, delete the product from the chosenProducts state
            if (count === 0) {
                delete state.chosenProducts[categoryName][product];
            } else {
                // Otherwise, update the count of the product in the chosenProducts state
                state.chosenProducts[categoryName][product] = count;
            }
        },
    },
});

export const { gatherProducts, updateProductCount } = chosenProductsSlice.actions;

export default chosenProductsSlice.reducer;