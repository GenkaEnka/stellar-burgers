import React, { FC, ReactNode } from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

type TAppNavLinkProps = {
  to: string;
  end?: boolean;
  children: (isActive: boolean) => ReactNode;
};

const AppNavLink: FC<TAppNavLinkProps> = ({ to, end, children }) => {
  const match = useMatch({ path: to, end });
  const isActive = !!match;

  return (
    <NavLink
      to={to}
      className={`${styles.link} ${isActive ? styles.link_active : ''}`}
    >
      {children(isActive)}
    </NavLink>
  );
};

const AppProfileLink: FC<TAppNavLinkProps> = ({ to, end, children }) => {
  const match = useMatch({ path: to, end });
  const isActive = !!match;

  return (
    <NavLink
      to={to}
      className={`${styles.link} ${styles.link_position_last} ${isActive ? styles.link_active : ''}`}
    >
      {children(isActive)}
    </NavLink>
  );
};

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <AppNavLink to='/' end>
          {(isActive) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </>
          )}
        </AppNavLink>
        <AppNavLink to='/feed'>
          {(isActive) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </>
          )}
        </AppNavLink>
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <AppProfileLink to='/profile'>
        {(isActive) => (
          <>
            <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </>
        )}
      </AppProfileLink>
    </nav>
  </header>
);
