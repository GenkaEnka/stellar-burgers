import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName, pathname }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink to='/' className={`${styles.link} ${pathname === '/' ? styles.link_active : ''}`}>
          <BurgerIcon type={pathname === '/' ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
        </NavLink>
        <NavLink to='/feed' className={`${styles.link} ${pathname.startsWith('/feed') ? styles.link_active : ''}`}>
          <ListIcon type={pathname.startsWith('/feed') ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2'>Лента заказов</p>
        </NavLink>
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <NavLink to='/profile' className={`${styles.link_position_last} ${pathname.startsWith('/profile') ? styles.link_active : ''}`}>
        <ProfileIcon type={pathname.startsWith('/profile') ? 'primary' : 'secondary'} />
        <p className='text text_type_main-default ml-2'>
          {userName || 'Личный кабинет'}
        </p>
      </NavLink>
    </nav>
  </header>
);
