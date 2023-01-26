import styles from './Search.module.scss'
import { ProductCard } from '@components/ProductCard'
import { FiltersSidebar } from '@components/FiltersSidebar'
import { Sidebar } from '@shared/layout/components/Sidebar/Sidebar'
import { LayoutContent } from '@shared/layout/components/Content/LayoutContent'
import { getEntityDataHook } from '@shared/hooks/getEntityDataHook'
import { PostEntity } from '@models/PostEntity'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { handleSearchPostHook } from '@shared/hooks/handleSearchPostHook'

export interface ISearchProps {
  hideSidebar?: boolean
}
export const Search = ({ hideSidebar }: ISearchProps) => {
  // const router = useRouter()
  // const searchPath: string[] = (router.query.searchPath as string[]) || []
  const { posts } = handleSearchPostHook()

  // const { data: posts, getData } = getEntityDataHook<PostEntity>('posts', false)

  // useEffect(() => {
  //   console.log('query', router.query)
  //   const queryParams = router.query || {}
  //   delete queryParams.searchPath
  //   if (router.query) {
  //     getData({ path: searchPath.join('/'), queryParams })
  //   }
  // }, [router.query])

  return (
    <LayoutContent className={styles.SearchWrapper}>
      {!hideSidebar && (
        <Sidebar>
          <FiltersSidebar />
        </Sidebar>
      )}
      <div className={`${styles.SearchContent} grid-gap-15 grid-column-fill-2`}>
        {posts.map((item, i) => (
          <ProductCard product={item} key={i} />
        ))}
      </div>
    </LayoutContent>
  )
}
