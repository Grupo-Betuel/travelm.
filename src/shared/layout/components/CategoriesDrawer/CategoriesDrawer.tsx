import { Drawer, DrawerProps } from 'antd'
import styles from './CategoriesDrawer.module.scss'
import { getAuthData, appLogOut } from '../../../../utils/auth.utils'
import { ClientEntity } from '@shared/entities/ClientEntity'
import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import { CategoryEntity } from '@shared/entities/CategoryEntity'

export interface ICategoriesDrawerProps extends DrawerProps {
  authenticate: () => void
}

export const CategoriesDrawer = ({
  authenticate,
  ...props
}: ICategoriesDrawerProps) => {
  const authUser = getAuthData('user') as ClientEntity
  const { data: categories } = handleEntityHook<CategoryEntity>(
    'categories',
    true
  )

  return (
    <Drawer
      className={styles.CategoriesDrawer}
      title="All Categories"
      placement="left"
      {...props}
    >
      {authUser && <h3>Hola {authUser.name}!</h3>}
      <ul className={styles.CategoriesOptionsList}>
        <li className={`${styles.CategoriesOptionTitle}`}>Cat 1</li>
        {categories.map((item) => (
          <li key={item.slug} className={`${styles.CategoriesOption}`}>
            {item.name}
          </li>
        ))}
      </ul>
      <ul className={styles.CategoriesOptionsList}>
        <li className={`${styles.CategoriesOptionTitle}`}>Cat 2</li>
        {categories.map((item) => (
          <li key={item.slug} className={`${styles.CategoriesOption}`}>
            {item.name}
          </li>
        ))}
      </ul>
      <ul className={styles.CategoriesOptionsList}>
        <li className={`${styles.CategoriesOptionTitle}`}>Help & Setting</li>
        <li className={`${styles.CategoriesOption}`}>Como vender?</li>
        <li className={`${styles.CategoriesOption}`}>Language</li>
        {authUser ? (
          <>
            <li className={`${styles.CategoriesOption}`}>Mi Cuenta</li>
            <li className={`${styles.CategoriesOption}`} onClick={appLogOut}>
              Cerrar Session
            </li>
          </>
        ) : (
          <li className={`${styles.CategoriesOption}`} onClick={authenticate}>
            Login
          </li>
        )}
      </ul>
    </Drawer>
  )
}
