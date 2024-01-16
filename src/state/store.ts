import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './totalProducts/productsSlice'
import chosenProductsReducer from './orderSummary/orderSummarySlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    chosenProducts: chosenProductsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;