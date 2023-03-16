import styles from './Search.module.scss'
import { ProductCard } from '@shared/components'
import { FiltersSidebar } from '@shared/components'
import { Sidebar } from '@shared/layout/components/Sidebar/Sidebar'
import { LayoutContent } from '@shared/layout/components/Content/LayoutContent'
import { handleSearchPostHook } from '@shared/hooks/handleSearchPostHook'
import crudData from './data.json'
import { PostEntity } from '@shared/entities/PostEntity'
import { useState } from 'react'
import { toast } from 'react-toastify'

export interface ISearchProps {
  hideSidebar?: boolean
}
export const Search = ({ hideSidebar }: ISearchProps) => {
  const {
    posts,
    applyFilters,
    categories,
    loadMoreCallback,
    noMoreContent,
    loading,
  } = handleSearchPostHook()
  const data: PostEntity[] = crudData as any
  const [openModal, setOpenModal] = useState(false)
  const handlePostActions = (post: PostEntity) => {
    // if (post.storeId) {
    //   setOpenModal(!openModal)
    // } else {
    toast('Added to your board!')
    // }
  }

  return (
    <LayoutContent className={styles.SearchWrapper}>
      {!hideSidebar && (
        <Sidebar>
          <h1>posts: {posts.length}</h1>
          <FiltersSidebar applyFilters={applyFilters} categories={categories} />
        </Sidebar>
      )}
      <div className={`${styles.SearchContent} grid-gap-15 grid-column-fill-2`}>
        {[...posts].map((item, i) => (
          <ProductCard
            handleAction={handlePostActions}
            product={item}
            key={i}
          />
        ))}
        {!hideSidebar && posts.length && (
          <div className="grid-column-full py-x-l">
            {loading ? (
              <h1 className="flex-center-center w-100">Loading...</h1>
            ) : (
              <div>
                {!noMoreContent ? (
                  <h1
                    ref={loadMoreCallback}
                    className="flex-center-center w-100"
                  >
                    Mas Contenido
                  </h1>
                ) : (
                  <h1 className="d-flex w-100">No hay mas datos...</h1>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </LayoutContent>
  )
}
