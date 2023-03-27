import { PostEntity } from '@shared/entities/PostEntity'
import { useRouter } from 'next/router'
import { isNotEmptyObject } from '../../utils/matching.util'
import { useEffect, useRef, useState } from 'react'
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum'
import { useContextualRouting } from 'next-use-contextual-routing'
import { IPostFilters } from '@interfaces/posts.interface'
import { IPaginatedResponse } from '@interfaces/pagination.interface'
import { CategoryEntity } from '@shared/entities/CategoryEntity'
import queryString from 'query-string'
import { useInfiniteScroll } from './useInfiniteScrollHook'
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
  const { makeContextualHref, returnHref } = useContextualRouting()
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

  // TODO: check why this is being executed twice
  useEffect(() => {
    console.log('return', returnHref)
    // if (JSON.stringify(queryRef.current) !== JSON.stringify(router.query)) {
    //   console.log('query =>', router.query, queryRef.current)
    //   queryRef.current = router.query
    //   console.log('changed')
    console.log('query =>', router.query)

    // clearing filters
    if (router.query.clearFilters) {
      allFilters = {}
    }
    if (
      isNotEmptyObject(router.query) &&
      !router.query.slug &&
      !router.query.return
    ) {
      getPosts()
      // console.log('changed')
      // queryRef.current = router.query
    }
    // }
  }, [router.query])

  const getPosts = () => {
    // TODO: remove this comment is they are not usable
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
      allFilters = filtersToApply
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

  const parsePostFilters = (filters: IPostFilters): IPostFilters => {
    const responseF: IPostFilters = {}
    const f: IPostFilters = { ...allFilters, ...filters }
    console.log('filters =>', f)
    ;(Object.keys(f) as (keyof IPostFilters)[]).forEach(
      (key: keyof IPostFilters) => {
        const v = f[key]
        if (!!v) {
          ;(responseF as any)[key] = v
        }
        if (typeof v === 'object') {
          responseF[key] = JSON.stringify(v) as any
        }
      }
    )

    return responseF
  }

  const applyFilters = (filters: Partial<IPostFilters>) => {
    allFilters = parsePostFilters(filters)
    const queryString = new URLSearchParams(allFilters as any).toString()
    const searchPath = `/search/?${queryString}`
    router.push(makeContextualHref(allFilters), searchPath, {
      shallow: true,
    })
  }

  const categories = [
    {
      _id: '1',
      name: 'Beach',
      slug: 'Beach-62e6a79408f79af1b90884f9',
      params: [],
      subCategories: [
        {
          _id: '6317f24929b0f8bd8b03da7a',
          name: 'Santiago',
          slug: 'santiago-6317f24929b0f8bd8b03da7a',
          params: [
            '62e6a4bee913ef5766c03c78',
            '62e6a4be2ea2dc4523e3eec5',
            '62e6a4beb0bc36c8f8b68f55',
            '62e6a4be6bd0a30a819500ad',
            '62e6a4be2aa1f505b6a02c64',
            '62e6a4bedb8933b769c124d4',
          ],
        },
        {
          _id: '6317f2498172dbab64271170',
          name: 'Miles',
          slug: 'miles-6317f2498172dbab64271170',
          params: [
            '62e6a4be6ea48d78842f8848',
            '62e6a4bef1c8e5d054424e77',
            '62e6a4bedbee4c49eecc9b48',
            '62e6a4be7a090cb05ae786f1',
            '62e6a4bedf1eebce985ea893',
            '62e6a4be7af3961c750c6c8c',
          ],
        },
      ],
    },
    {
      _id: '2',
      name: 'Case',
      slug: 'Case-62e6a794c1377e489bc5906c',
      params: [
        '62e6a4bee913ef5766c03c78',
        '62e6a4be2ea2dc4523e3eec5',
        '62e6a4beb0bc36c8f8b68f55',
        '62e6a4be6bd0a30a819500ad',
        '62e6a4be2aa1f505b6a02c64',
        '62e6a4bedb8933b769c124d4',
      ],
      subCategories: [
        {
          _id: '6317f2492544dc2c9b0de3ec',
          name: 'Patterson',
          slug: 'patterson-6317f2492544dc2c9b0de3ec',
          params: [
            '62e6a4be6ea48d78842f8848',
            '62e6a4be81142f3ffb887794',
            '62e6a4be2ea2dc4523e3eec5',
            '62e6a4bece0f8832ed6991d9',
            '62e6a4bebd316d56503f32ce',
            '62e6a4be327ca1bfa62087e9',
          ],
        },
        {
          _id: '6317f24971e38dbd59545f3d',
          name: 'Oconnor',
          slug: 'oconnor-6317f24971e38dbd59545f3d',
          params: [
            '62e6a4befb6fb311b438fd12',
            '62e6a4bedb8933b769c124d4',
            '62e6a4be90c526b722292f02',
            '62e6a4be777ebd8553f175d0',
            '62e6a4bedbee4c49eecc9b48',
            '62e6a4bedbee4c49eecc9b48',
          ],
        },
      ],
    },
    {
      _id: '3',
      name: 'Dunlap',
      slug: 'Dunlap-62e6a794064c739cbde21386',
      params: [
        '62e6a4befb6fb311b438fd12',
        '62e6a4bedb8933b769c124d4',
        '62e6a4be90c526b722292f02',
        '62e6a4be777ebd8553f175d0',
        '62e6a4bedbee4c49eecc9b48',
        '62e6a4bedbee4c49eecc9b48',
      ],
      subCategories: [],
    },
    {
      _id: '4',
      name: 'Tucker',
      slug: 'Tucker-62e6a7949ce4fcf22a0db38b',
      params: [
        '62e6a4be6ea48d78842f8848',
        '62e6a4bef1c8e5d054424e77',
        '62e6a4bedbee4c49eecc9b48',
        '62e6a4be7a090cb05ae786f1',
        '62e6a4bedf1eebce985ea893',
        '62e6a4be7af3961c750c6c8c',
      ],
      subCategories: [
        {
          _id: '6317f2494ac4175bcc087aba',
          name: 'Merritt',
          slug: 'merritt-6317f2494ac4175bcc087aba',
          params: [
            '62e6a4be88093398a18dda04',
            '62e6a4bec2349f4884707872',
            '62e6a4be0caf8d0672f57c1a',
            '62e6a4bedb8933b769c124d4',
            '62e6a4be448a75130096a246',
            '62e6a4be5fb0f3b98dc10e8a',
          ],
        },
      ],
    },
    {
      _id: '5',
      name: 'Wilder',
      slug: 'Wilder-62e6a794419421a611d60e99',
      params: [
        '62e6a4be6ea48d78842f8848',
        '62e6a4be81142f3ffb887794',
        '62e6a4be2ea2dc4523e3eec5',
        '62e6a4bece0f8832ed6991d9',
        '62e6a4bebd316d56503f32ce',
        '62e6a4be327ca1bfa62087e9',
      ],
      subCategories: [],
    },
  ]

  // reseting filters
  useEffect((): any => {
    return () => (allFilters = {})
  }, [])

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
