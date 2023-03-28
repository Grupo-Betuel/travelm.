import {
  LandingCarousel,
  ScrollView,
  VerticalPreviewCard,
} from '@shared/components'
import styles from './Home.module.scss'
import { PostEntity } from '@shared/entities/PostEntity'
import { useEffect } from 'react'
import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum'
import { getAuthData } from 'src/utils/auth.utils'
import { UserEntity } from '@shared/entities/UserEntity'

export const Home = () => {
  const {
    data: products,
    get: getPosts,
    ['random-by-role']: randomResellerPosts,
    ['you-may-like']: youMayLikePosts,
    randomStoresPosts,
  } = handleEntityHook<PostEntity>('posts', true)
  const authUser = getAuthData('user') as UserEntity
  useEffect(() => {
    // getting reseler posts
    getPosts({
      endpoint: EndpointsAndEntityStateKeys.RANDOM_BY_ROLE,
      queryParams: { role: 'reseller', size: 4 },
    })

    // getting stores posts
    getPosts({
      endpoint: EndpointsAndEntityStateKeys.RANDOM_BY_ROLE,
      queryParams: { role: 'store', size: 4 },
      storeDataInStateKey: EndpointsAndEntityStateKeys.RANDOM_POSTS_BY_STORE,
    })

    // getting you may like posts
    getPosts({
      endpoint: EndpointsAndEntityStateKeys.YOU_MAY_LIKE,
      queryParams: { userId: authUser._id },
    })

     // getting most viewd posts
    //  getPosts({
    //   endpoint: EndpointsAndEntityStateKeys.YOU_MAY_LIKE,
    //   queryParams: { userId: authUser._id },
    // })
  }, [])

  return (
    <div className={styles.HomeWrapper}>
      <div className={styles.LandingCarouselWrapper}>
        <LandingCarousel />
      </div>
      <div className={styles.HomeContent}>
        <div className={styles.HomeTopCardsGrid}>
          <VerticalPreviewCard
            items={randomResellerPosts?.data}
            title="Revendedores"
          />
          <VerticalPreviewCard
            items={randomStoresPosts?.data}
            title="Publicaciones de Tienda"
          />
          <VerticalPreviewCard
            items={products.slice(0, 4)}
            title="Publicaciones"
          />

          <VerticalPreviewCard
            items={products.slice(4, 8)}
            title="Publicaciones"
          />
        </div>
        <ScrollView title="You may like" products={youMayLikePosts?.data} />
        <ScrollView title="Recents posts" products={products} />
      </div>
    </div>
  )
}
