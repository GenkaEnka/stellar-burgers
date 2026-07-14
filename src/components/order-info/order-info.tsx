import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/ordersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.feed);
  const { orders: profileOrders, orderModalData } = useSelector((state) => state.orders);
  const { data: ingredients } = useSelector((state) => state.ingredients);

  const orderData = useMemo(() => {
    const parsedNumber = Number(number);
    return (
      [...orders, ...profileOrders].find((item) => item.number === parsedNumber) ||
      orderModalData ||
      null
    );
  }, [number, orders, profileOrders, orderModalData]);

  useEffect(() => {
    const parsedNumber = Number(number);
    const exists = [...orders, ...profileOrders].some(
      (item) => item.number === parsedNumber
    );
    if (!exists && parsedNumber) {
      dispatch(fetchOrderByNumber(parsedNumber));
    }
  }, [number, orders, profileOrders, dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const orderIngredients = orderData.ingredients ?? [];
    const ingredientsInfo = orderIngredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredients: orderIngredients,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
