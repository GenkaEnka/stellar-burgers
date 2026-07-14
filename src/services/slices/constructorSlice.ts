import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => ({
      ...state,
      ingredients: [...(state.ingredients ?? []), action.payload]
    }),
    addBun: (state, action: PayloadAction<TIngredient>) => ({
      ...state,
      bun: action.payload
    }),
    removeIngredient: (state, action: PayloadAction<string>) => ({
      ...state,
      ingredients: (state.ingredients ?? []).filter((item) => item.id !== action.payload)
    }),
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const ingredients = [...(state.ingredients ?? [])];
      const index = action.payload;
      if (index > 0) {
        [ingredients[index - 1], ingredients[index]] = [ingredients[index], ingredients[index - 1]];
      }
      return { ...state, ingredients };
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const ingredients = [...(state.ingredients ?? [])];
      const index = action.payload;
      if (index < ingredients.length - 1) {
        [ingredients[index], ingredients[index + 1]] = [ingredients[index + 1], ingredients[index]];
      }
      return { ...state, ingredients };
    },
    clearConstructor: () => initialState
  }
});

export const {
  addIngredient,
  addBun,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
