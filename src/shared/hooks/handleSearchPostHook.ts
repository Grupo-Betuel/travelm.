import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import { PostEntity } from '@shared/entities/PostEntity'
import { useRouter } from 'next/router'
import { deepMatch, isNotEmptyObject } from '../../utils/matching.util'
import { useEffect, useRef, useState } from 'react'
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum'
import { useContextualRouting } from 'next-use-contextual-routing'
import { IPostFilters } from '@interfaces/posts.interface'
import { IPaginatedResponse } from '@interfaces/pagination.interface'
import { CategoryEntity } from '@shared/entities/CategoryEntity'
import { useInfiniteScroll } from './useInfiniteScrollHook'
import { all } from 'axios'
export interface IHandleSearchPostHookData {
  posts: PostEntity[]
  pagination: IPaginatedResponse<PostEntity>
  applyFilters: (f: Partial<IPostFilters>) => void
  categories: CategoryEntity[]
  loadMoreCallback: (el: HTMLDivElement) => void
  noMoreContent?: boolean
  loading?: boolean
}

let allFilters: Partial<IPostFilters> = {}

export const handleSearchPostHook = (): IHandleSearchPostHookData => {
  const router = useRouter()
  const [posts, setPosts] = useState<PostEntity[]>([])
  const [noMoreContent, setNoMoreContent] = useState<boolean>(false)
  const { makeContextualHref } = useContextualRouting()
  const didMount = useRef(false)
  const queryRef = useRef(router.query)
  const {
    searchPostsResults,
    get,
    setInfinityScrollFetchProperties,
    infinityScrollData,
    loadMoreCallback,
    isLastPage,
    fetching,
    loading,
    setInfinityScrollPage,
    setInfinityScrollIsLastPage,
  } = useInfiniteScroll<PostEntity>('posts')

  useEffect(() => {
    setNoMoreContent(isLastPage)
  }, [isLastPage])

  useEffect(() => {
    setPosts(searchPostsResults?.data || [])
    const noMoreContent =
      !searchPostsResults?.pagination ||
      searchPostsResults?.pagination?.totalPages === 1
    console.log('seartch', noMoreContent)

    setNoMoreContent(noMoreContent)
    setInfinityScrollIsLastPage(noMoreContent)
    setInfinityScrollPage(1)
  }, [searchPostsResults?.data])

  useEffect(() => {
    setPosts(infinityScrollData?.data || [])
  }, [infinityScrollData?.data])

  useEffect(() => {
    // if (JSON.stringify(queryRef.current) !== JSON.stringify(router.query)) {
    //   console.log('query =>', router.query, queryRef.current)
    //   queryRef.current = router.query
    //   console.log('changed')

    if (isNotEmptyObject(router.query)) {
      getPosts()
      // console.log('changed')
      // queryRef.current = router.query
    }
    // }
  }, [router.query])

  const getPosts = () => {
    // const searchPath = ((router.query.searchPath as string[]) || []).join(',')
    // const extraPath = router.query.extraPath as string
    // console.log('query', router.query)
    // const queryParams = { ...router.query }
    // delete queryParams.searchPath
    // delete queryParams.extraPath
    const filtersToApply = isNotEmptyObject(allFilters)
      ? allFilters
      : router.query

    if (isNotEmptyObject(filtersToApply)) {
      const getProps = {
        queryParams: filtersToApply,
        storeDataInStateKey: EndpointsAndEntityStateKeys.SEARCH_POST_RESULTS,
      }

      setInfinityScrollFetchProperties(getProps)
      console.log('getting')
      console.log(allFilters)
      get(getProps)
    }
  }

  const applyFilters = (filters: Partial<IPostFilters>) => {
    allFilters = { ...allFilters, ...filters }
    setTimeout(() => {
      console.log('filters', allFilters)
    })
    const queryString = new URLSearchParams(filters as any).toString()
    const searchPath = `/search/?${queryString}`
    router.push(makeContextualHref(allFilters as any), searchPath, {
      shallow: true,
    })
  }

  const categories = [
    {
      _id: 'id',
      name: 'Beach',
      slug: 'Beach-62e6a79408f79af1b90884f9',
      params: ['62e6a4be2a30bd57a67c2f22', '62e6a4be5666906144292211'],
      subCategories: [
        {
          _id: '6317f24929b0f8bd8b03da7a',
          name: 'Santiago',
          slug: 'santiago-6317f24929b0f8bd8b03da7a',
          params: ['62e6a4bedb534f3194480acd'],
        },
        {
          _id: '6317f2498172dbab64271170',
          name: 'Miles',
          slug: 'miles-6317f2498172dbab64271170',
          params: ['62e6a4be2ea2dc4523e3eec5', '62e6a4bebcd6f975f3f0c2dd'],
        },
      ],
    },
    {
      _id: 'id',
      name: 'Case',
      slug: 'Case-62e6a794c1377e489bc5906c',
      params: ['62e6a4be70c9068e7eee0198', '62e6a4bece0f8832ed6991d9'],
      subCategories: [
        {
          _id: '6317f24971e38dbd59545f3d',
          name: 'Oconnor',
          slug: 'oconnor-6317f24971e38dbd59545f3d',
          params: ['62e6a4bebcd6f975f3f0c2dd', '62e6a4be0f8b69394a91401d'],
        },
        {
          _id: '6317f2492544dc2c9b0de3ec',
          name: 'Patterson',
          slug: 'patterson-6317f2492544dc2c9b0de3ec',
          params: ['62e6a4be6bd0a30a819500ad'],
        },
      ],
    },
    {
      _id: 'id',
      name: 'Dunlap',
      slug: 'Dunlap-62e6a794064c739cbde21386',
      params: ['62e6a4be7af3961c750c6c8c'],
      subCategories: [],
    },
    {
      _id: 'id',
      name: 'Tucker',
      slug: 'Tucker-62e6a7949ce4fcf22a0db38b',
      params: ['62e6a4be68ecbe05d9a433fc'],
      subCategories: [
        {
          _id: '6317f2494ac4175bcc087aba',
          name: 'Merritt',
          slug: 'merritt-6317f2494ac4175bcc087aba',
          params: ['62e6a4bea3a7ffa0f1ec9411'],
        },
      ],
    },
    {
      _id: 'id',
      name: 'Wilder',
      slug: 'Wilder-62e6a794419421a611d60e99',
      subCategories: [],
      params: ['62e6a4be68ecbe05d9a433fc', '62e6a4be4d9086afa43bcec9'],
    },
  ]

  return {
    posts,
    applyFilters,
    pagination: searchPostsResults?.pagination || ({} as any),
    categories,
    loadMoreCallback,
    noMoreContent,
    loading: loading || fetching,
  }
}
