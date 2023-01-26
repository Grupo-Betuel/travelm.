import styles from './Search.module.scss'
import { ProductCard } from '@components/ProductCard'
import { FiltersSidebar } from '@components/FiltersSidebar'
import { Sidebar } from '@shared/layout/components/Sidebar/Sidebar'
import { LayoutContent } from '@shared/layout/components/Content/LayoutContent'
import { handleSearchPostHook } from '@shared/hooks/handleSearchPostHook'

export interface ISearchProps {
  hideSidebar?: boolean
}
export const Search = ({ hideSidebar }: ISearchProps) => {
  const { posts } = handleSearchPostHook()

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
