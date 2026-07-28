import { RootState } from './store';

export const selectIngredients = (state: RootState) => state.ingredients;
export const selectIngredientsData = (state: RootState) =>
  state.ingredients.data;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;

export const selectConstructor = (state: RootState) => state.constructor;
export const selectConstructorBun = (state: RootState) => state.constructor.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.constructor.ingredients;

export const selectFeed = (state: RootState) => state.feed;
export const selectFeedOrders = (state: RootState) => state.feed.orders;

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.auth.isAuthChecked;

export const selectOrders = (state: RootState) => state.orders;
export const selectMyOrders = (state: RootState) => state.orders.orders;
export const selectOrderByNumber = (state: RootState) =>
  state.orders.orderByNumber;
export const selectOrderModalData = (state: RootState) =>
  state.orders.orderModalData;
export const selectOrderRequest = (state: RootState) =>
  state.orders.orderRequest;
