import { Drawer, DrawerProps } from 'antd'
import styles from './CategoriesDrawer.module.scss'
import { getAuthData, appLogOut } from '../../../../utils/auth.utils'
import { UserEntity } from '@shared/entities/UserEntity'
import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import { CategoryEntity } from '@shared/entities/CategoryEntity'

export interface ICategoriesDrawerProps extends DrawerProps {
  authenticate: () => void
}

export const CategoriesDrawer = ({
  authenticate,
  ...props
}: ICategoriesDrawerProps) => {
  const authUser = getAuthData('user') as UserEntity
  const { data: categories } = handleEntityHook<CategoryEntity>(
    'categories',
    true
  )

  return (
    <Drawer
      className={styles.categoriesDrawer}
      title="All Categories"
      placement="left"
      {...props}
    >
      {authUser && <h3>Hola {authUser.name}!</h3>}
      <ul className={styles.categoryList}>
        <li className={`${styles.categoryListItemTitle}`}>Cat 1</li>
        {categories.map((item) => (
          <li key={item._id} className={`${styles.categoryListItem}`}>
            {item.name}
          </li>
        ))}
      </ul>
      <ul className={styles.categoryList}>
        <li className={`${styles.categoryListItemTitle}`}>Cat 2</li>
        {categories.map((item) => (
          <li key={item._id} className={`${styles.categoryListItem}`}>
            {item.name}
          </li>
        ))}
      </ul>
      <ul className={styles.categoryList}>
        <li className={`${styles.categoryListItemTitle}`}>Help & Setting</li>
        <li className={`${styles.categoryListItem}`}>Como vender?</li>
        <li className={`${styles.categoryListItem}`}>Language</li>
        {authUser ? (
          <>
            <li className={`${styles.categoryListItem}`}>Mi Cuenta</li>
            <li className={`${styles.categoryListItem}`} onClick={appLogOut}>
              Cerrar Session
            </li>
          </>
        ) : (
          <li className={`${styles.categoryListItem}`} onClick={authenticate}>
            Login
          </li>
        )}
      </ul>
    </Drawer>
  )
}
