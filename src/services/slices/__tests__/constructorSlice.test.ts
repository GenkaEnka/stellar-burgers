import constructorReducer, {
  addIngredient,
  addBun,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const mockBun: TIngredient = {
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

const mockMain: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  id: 'test-id-1'
};

const mockMain2: TConstructorIngredient = {
  ...mockMain,
  id: 'test-id-2',
  name: 'Филе Люминесцентного тетраодонтимформа'
};

describe('constructorSlice reducer', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  test('should return initial state for unknown action when state is undefined', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  test('should handle addBun', () => {
    const state = constructorReducer(initialState, addBun(mockBun));
    expect(state.bun).toEqual(mockBun);
    expect(state.ingredients).toEqual([]);
  });

  test('should replace bun when adding a new bun', () => {
    const stateWithBun = constructorReducer(initialState, addBun(mockBun));

    const newBun: TIngredient = {
      ...mockBun,
      _id: 'new-bun-id',
      name: 'Флюоресцентная булка R2-D3'
    };

    const state = constructorReducer(stateWithBun, addBun(newBun));
    expect(state.bun).toEqual(newBun);
  });

  test('should handle addIngredient', () => {
    const state = constructorReducer(initialState, addIngredient(mockMain));
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockMain);
  });

  test('should handle removeIngredient', () => {
    const stateWithIngredients = constructorReducer(
      initialState,
      addIngredient(mockMain)
    );
    const stateWithTwoIngredients = constructorReducer(
      stateWithIngredients,
      addIngredient(mockMain2)
    );

    expect(stateWithTwoIngredients.ingredients).toHaveLength(2);

    const state = constructorReducer(
      stateWithTwoIngredients,
      removeIngredient(mockMain.id)
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe(mockMain2.id);
  });

  test('should handle moveIngredientUp', () => {
    const stateWithIngredients = constructorReducer(
      initialState,
      addIngredient(mockMain)
    );
    const stateWithTwo = constructorReducer(
      stateWithIngredients,
      addIngredient(mockMain2)
    );

    // Move second ingredient up (index 1 -> index 0)
    const state = constructorReducer(stateWithTwo, moveIngredientUp(1));
    expect(state.ingredients[0].id).toBe(mockMain2.id);
    expect(state.ingredients[1].id).toBe(mockMain.id);
  });

  test('should not move ingredient up if it is already the first', () => {
    const stateWithIngredients = constructorReducer(
      initialState,
      addIngredient(mockMain)
    );
    const state = constructorReducer(stateWithIngredients, moveIngredientUp(0));
    expect(state.ingredients[0].id).toBe(mockMain.id);
  });

  test('should handle moveIngredientDown', () => {
    const stateWithIngredients = constructorReducer(
      initialState,
      addIngredient(mockMain)
    );
    const stateWithTwo = constructorReducer(
      stateWithIngredients,
      addIngredient(mockMain2)
    );

    // Move first ingredient down (index 0 -> index 1)
    const state = constructorReducer(stateWithTwo, moveIngredientDown(0));
    expect(state.ingredients[0].id).toBe(mockMain2.id);
    expect(state.ingredients[1].id).toBe(mockMain.id);
  });

  test('should not move ingredient down if it is already the last', () => {
    const stateWithIngredients = constructorReducer(
      initialState,
      addIngredient(mockMain)
    );
    const stateWithTwo = constructorReducer(
      stateWithIngredients,
      addIngredient(mockMain2)
    );
    const state = constructorReducer(stateWithTwo, moveIngredientDown(1));
    expect(state.ingredients[1].id).toBe(mockMain2.id);
  });

  test('should handle clearConstructor', () => {
    const stateWithItems = constructorReducer(
      { bun: mockBun, ingredients: [mockMain] },
      { type: 'some-action' }
    );
    const state = constructorReducer(stateWithItems, clearConstructor());
    expect(state).toEqual(initialState);
  });
});
