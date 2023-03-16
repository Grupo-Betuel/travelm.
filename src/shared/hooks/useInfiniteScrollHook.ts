// useInfiniteScroll.ts
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  handleEntityHook,
  IGetEntityDataHookReturn,
} from '@shared/hooks/handleEntityHook'
import { EntityNamesType } from '@services/appEntitiesWithService'
import { IServiceMethodProperties } from '@services/BaseService'
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum'
import { IEntityEndpointDataValue } from '@interfaces/entities.interface'

export interface UseInfiniteScroll<T> {
  loadMoreCallback: (el: HTMLDivElement) => void
  isLastPage: boolean
  setInfinityScrollFetchProperties: Dispatch<
    SetStateAction<IServiceMethodProperties<T>>
  >
  setInfinityScrollPage: Dispatch<SetStateAction<number>>
  setInfinityScrollIsLastPage: Dispatch<SetStateAction<boolean>>
}
const debounceTime = 600

export function useInfiniteScroll<T>(
  entityName: EntityNamesType
): UseInfiniteScroll<T> & IGetEntityDataHookReturn<T> {
  const entity = handleEntityHook<T>(entityName, false, {
    debounceTime,
  })
  const [page, setPage] = useState(1)
  const [isLastPage, setIsLastPage] = useState(false)
  const [fetchProperties, setFetchProperties] = useState<
    IServiceMethodProperties<T>
  >({})
  const observerRef = useRef<IntersectionObserver>()
  const loadMoreTimeout: NodeJS.Timeout = setTimeout(() => null, debounceTime)
  const loadMoreTimeoutRef = useRef<NodeJS.Timeout>(loadMoreTimeout)

  useEffect(() => {
    const infinityScroll =
      entity.infinityScrollData as IEntityEndpointDataValue<T>
    if (infinityScroll && infinityScroll.pagination) {
      setIsLastPage(page >= infinityScroll.pagination.totalPages)
    }
  }, [entity.infinityScrollData])

  const handleObserver =
    // useCallback(
    (entries: any[]) => {
      const target = entries[0]
      if (target.isIntersecting && !isLastPage) {
        clearTimeout(loadMoreTimeoutRef.current)

        // this timeout debounces the intersection events
        loadMoreTimeoutRef.current = setTimeout(() => {
          if (
            !entity.infinityScrollData ||
            !entity.infinityScrollData.pagination ||
            (entity.infinityScrollData.pagination &&
              page <= entity.infinityScrollData.pagination.totalPages)
          ) {
            entity.get({
              ...fetchProperties,
              queryParams: {
                ...fetchProperties.queryParams,
                page,
              },
              storeDataInStateKey:
                EndpointsAndEntityStateKeys.INFINITE_SCROLL_DATA,
            })
            const nextPage = page + 1
            setPage(nextPage)
          }
        }, debounceTime)
      }
    }
  // ,
  //   [loadMoreTimeoutRef, page, isLastPage, fetchProperties]
  // )

  const loadMoreCallback =
    // useCallback(
    (el: HTMLDivElement) => {
      if (entity.fetching || entity.loading) return
      if (observerRef.current) observerRef.current.disconnect()

      const option: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }
      observerRef.current = new IntersectionObserver(handleObserver, option)

      if (el) observerRef.current.observe(el)
    }
  // ,
  // [entity.fetching, isLastPage]
  // )

  return {
    setInfinityScrollFetchProperties: setFetchProperties,
    loadMoreCallback,
    isLastPage,
    setInfinityScrollPage: setPage,
    setInfinityScrollIsLastPage: setIsLastPage,
    ...entity,
  }
}
