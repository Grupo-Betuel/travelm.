import { AppViewportHeightContext } from '@shared/contexts/AppViewportHeightContext';
import { useContext } from 'react';
import styles from './MainContentModal.module.scss';

export interface IMainContentModalProps {
  children?: any
  show?: boolean
  transparent?: boolean
}
export function MainContentModal({
  children,
  show,
  transparent,
}: IMainContentModalProps) {
  const appViewportHeight = useContext(AppViewportHeightContext);

  return show ? (
    <div
      className={`${styles.MainContentModal} ${
        transparent ? styles.Transparent : ''
        // eslint-disable-next-line react/destructuring-assignment
      } ${appViewportHeight.appViewportHeightClassName}`}
    >
      {children}
    </div>
  ) : (
    <></>
  );
}
