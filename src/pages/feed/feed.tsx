import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.feed);

  if (loading && !orders.length) {
    return null;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />;
};
