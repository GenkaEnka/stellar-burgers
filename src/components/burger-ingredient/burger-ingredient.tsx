import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import { addBun, addIngredient } from '../../services/slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { bun, ingredients = [] } = useSelector((state) => state.constructor ?? { bun: null, ingredients: [] });

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        dispatch(addIngredient({ ...ingredient, id: `${ingredient._id}-${ingredients.length + 1}` }));
      }
    };

    const totalCount = ingredient.type === 'bun' && bun?._id === ingredient._id ? 2 : count;

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={totalCount}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
