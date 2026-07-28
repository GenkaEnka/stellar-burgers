import ingredientsReducer, {
  fetchIngredients
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
};

describe('ingredientsSlice reducer', () => {
  const initialState = {
    data: [],
    loading: false,
    error: null
  };

  test('should return initial state for unknown action when state is undefined', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  test('should handle fetchIngredients.pending', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type
    });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('should handle fetchIngredients.fulfilled', () => {
    const mockData = [mockIngredient];
    const state = ingredientsReducer(
      { data: [], loading: true, error: null },
      {
        type: fetchIngredients.fulfilled.type,
        payload: mockData
      }
    );
    expect(state.loading).toBe(false);
    expect(state.data).toEqual(mockData);
  });

  test('should handle fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки';
    const state = ingredientsReducer(
      { data: [], loading: true, error: null },
      {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      }
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('should handle fetchIngredients.rejected with no error message', () => {
    const state = ingredientsReducer(
      { data: [], loading: true, error: null },
      {
        type: fetchIngredients.rejected.type,
        error: { message: undefined }
      }
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });
});
