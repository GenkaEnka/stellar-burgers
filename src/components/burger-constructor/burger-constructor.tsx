import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { clearOrderModal, createOrder } from '../../services/slices/ordersSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorState = useSelector((state) => state.constructor);
  const constructorItems = {
    bun: constructorState?.bun ?? null,
    ingredients: Array.isArray(constructorState?.ingredients) ? constructorState.ingredients : []
  };
  const { bun = null, ingredients = [] } = constructorItems;
  const { orderRequest, orderModalData } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!bun || orderRequest) return;
    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    dispatch(createOrder(ingredientIds));
  };
  const closeOrderModal = () => {
    dispatch(clearOrderModal());
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
