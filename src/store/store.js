import { configureStore } from '@reduxjs/toolkit'
import { initialiseUser } from './slices/authSlice';
import authReducer from "./slices/authSlice";
import messageReducer from "./slices/messageSlice";
import loadingReducer from "./slices/loadingSlice";
import categoriesReducer from "./slices/categorySlice";
import productsByCategoryReducer from "./slices/productsByCategorySlice";
import productsReducer from "./slices/productsSlice";
import cartReducer from './slices/cartSlice';

const reducer = {
    auth: authReducer,
    message: messageReducer,
    loading: loadingReducer,
    categories: categoriesReducer,
    products: productsReducer,
    productsByCategory: productsByCategoryReducer,
    cart: cartReducer,
}

export const store = configureStore({
    reducer: reducer,
    devTools: true,
});

store.dispatch(initialiseUser());

export default store;