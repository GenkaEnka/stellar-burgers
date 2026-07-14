import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const { orders } = useSelector((state) => state.orders);

  return <ProfileOrdersUI orders={orders} />;
};
