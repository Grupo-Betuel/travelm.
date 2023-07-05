import styles from './Home.module.scss'
import { getAuthData } from 'src/utils/auth.utils'
import { UserEntity } from '@shared/entities/UserEntity'

export const Home = () => {

  const authUser = getAuthData('user') as UserEntity

  return (
    <div className={styles.HomeWrapper}>
     <h1>Home</h1>
    </div>
  )
}

