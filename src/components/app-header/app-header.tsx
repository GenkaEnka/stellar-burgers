import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);

  return <AppHeaderUI userName={user?.name || ''} pathname={pathname} />;
};
