import styles from './Home.module.scss'
import { PostEntity } from '@shared/entities/PostEntity'
import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import { getAuthData } from 'src/utils/auth.utils'
import { UserEntity } from '@shared/entities/UserEntity'

export const Home = () => {

// TODO: LOOK THIS EXAMPLE OF THE USE OF THANDLEENTITYHOOK
  const {
    data: products,
    get: getPosts,
    ['random-by-role']: randomResellerPosts,
    ['you-may-like']: youMayLikePosts,
    randomStoresPosts,
  } = handleEntityHook<PostEntity>('posts', true)
  const authUser = getAuthData('user') as UserEntity

  return (
    <div className={styles.HomeWrapper}>
     <h1>Home</h1>
    </div>
  )
}
