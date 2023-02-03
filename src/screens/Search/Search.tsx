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
  const { posts } = handleSearchPostHook()
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
          <FiltersSidebar />
        </Sidebar>
      )}
      <div className={`${styles.SearchContent} grid-gap-15 grid-column-fill-2`}>
        {data.map((item, i) => (
          <ProductCard
            handleAction={handlePostActions}
            product={item}
            key={i}
          />
        ))}
      </div>
    </LayoutContent>
  )
}
