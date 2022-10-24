import styles from './Search.module.scss'
import { MainContentModal, ProductCard } from '@shared/components'
import { FiltersSidebar } from '@shared/components'
import { Sidebar } from '@shared/layout/components/Sidebar/Sidebar'
import { LayoutContent } from '@shared/layout/components/Content/LayoutContent'
import { handleSearchPostHook } from '@shared/hooks/handleSearchPostHook'
import crudData from './data.json'
import { PostEntity } from '@shared/entities/PostEntity'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { DetailView } from '@screens/DetailView'
import Link from 'next/link'
import { useContextualRouting } from 'next-use-contextual-routing'
import { useRouter } from 'next/router'

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
  const [selectedPost, setSelectedPost] = useState<PostEntity>()
  const [showContextProductDetailModal, setShowContextProductDetailModal] =
    useState(false)
  const { makeContextualHref, returnHref } = useContextualRouting()
  const router = useRouter()
  const handlePostActions = (post: PostEntity) => {
    // if (post.storeId) {
    //   setOpenModal(!openModal)
    // } else {
    toast('Added to your board!')
    // }
  }

  useEffect(() => {
    if (router.query.slug) {
      setShowContextProductDetailModal(true);
      const foundPost = posts.find(it => it.slug === router.query.slug);
      setSelectedPost(foundPost);;
    } else {
      setShowContextProductDetailModal(false)
    }
  }, [router.query])

  return (
    <LayoutContent className={styles.SearchWrapper}>
      <MainContentModal show={showContextProductDetailModal}>
        <DetailView selectedPost={selectedPost} returnHref={returnHref}></DetailView>
      </MainContentModal>
      {!hideSidebar && (
        <FiltersSidebar applyFilters={applyFilters} categories={categories} />
      )}
  
      <div className={`${styles.SearchContent} grid-gap-15 grid-column-fill-2`}>
        {[...posts].map((item, i) => (
          <Link
          style={{display: 'block'}}
            href={makeContextualHref({ slug: item.slug })}
            as={`/detail/${item.slug}`}
            key={i + item.slug}
          >
            <a>
              <ProductCard handleAction={handlePostActions} product={item} />
            </a>
          </Link>
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
