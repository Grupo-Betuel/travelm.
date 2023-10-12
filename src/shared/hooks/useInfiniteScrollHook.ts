// useInfiniteScroll.ts
import {
  Dispatch, SetStateAction, useEffect, useRef, useState,
} from 'react';
import {
  handleEntityHook,
  HandleEntityProps,
  IGetEntityDataHookReturn,
} from '@shared/hooks/handleEntityHook';
import { EntityNamesType } from '@services/appEntitiesWithService';
import { IServiceMethodProperties } from '@services/BaseService';
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum';
import { IEntityEndpointDataValue } from '@interfaces/entities.interface';
import { debounce } from 'lodash';

export interface UseInfiniteScroll<T> {
  loadMoreCallback: (el: HTMLDivElement) => void;
  isLastPage: boolean;
  setInfinityScrollFetchProperties: Dispatch<
  SetStateAction<IServiceMethodProperties<T>>
  >;
  setInfinityScrollPage: Dispatch<SetStateAction<number>>;
  setInfinityScrollIsLastPage: Dispatch<SetStateAction<boolean>>;
}

const debounceTime = 600;
const paginationConfig = {
  queryParams: {
    page: 1,
    limit: 20,
  },
};
export function useInfiniteScroll<T>(
  entityName: EntityNamesType,
  loadDataAutomatically?: boolean,
  properties: HandleEntityProps<T> = {},
): UseInfiniteScroll<T> & IGetEntityDataHookReturn<T> {
  const entity = handleEntityHook<T>(entityName, loadDataAutomatically, {
    debounceTime,
    storeDataInStateKey: EndpointsAndEntityStateKeys.INFINITE_SCROLL_DATA,
    ...paginationConfig,
    ...properties,
  });
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [fetchProperties, setFetchProperties] = useState<
  IServiceMethodProperties<T>
  >({ ...paginationConfig, ...properties });
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreTimeout: NodeJS.Timeout = setTimeout(() => null, debounceTime);
  const loadMoreTimeoutRef = useRef<NodeJS.Timeout>(loadMoreTimeout);

  useEffect(() => {
    const infinityScroll = entity.infinityScrollData as IEntityEndpointDataValue<T>;
    if (infinityScroll && infinityScroll.pagination) {
      setIsLastPage(page > infinityScroll.pagination.totalPages);
    }
  }, [entity.infinityScrollData]);

  const handleObserver = (entries: any[]) => {
    const target = entries[0];
    clearTimeout(loadMoreTimeoutRef.current);

    if (target.isIntersecting && !isLastPage) {
      // this timeout debounces the intersection events
      loadMoreTimeoutRef.current = setTimeout(() => {
        if (
          !entity.infinityScrollData
          || !entity.infinityScrollData.pagination
          || (entity.infinityScrollData.pagination
            && page <= entity.infinityScrollData.pagination.totalPages)
        ) {

          entity.get({
            ...fetchProperties,
            queryParams: {
              ...fetchProperties.queryParams,
              page,
            },
            storeDataInStateKey:
              EndpointsAndEntityStateKeys.INFINITE_SCROLL_DATA,
          });
          const nextPage = page + 1;
          setPage(nextPage);
        }
      }, debounceTime);
    }
  };

  const loadMoreCallback = debounce((el: HTMLDivElement) => {
    if (entity.fetching || entity.loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    const option: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };
    observerRef.current = new IntersectionObserver(handleObserver, option);

    if (el) observerRef.current.observe(el);
  }, 300);

  return {
    setInfinityScrollFetchProperties: setFetchProperties,
    loadMoreCallback,
    isLastPage,
    setInfinityScrollPage: setPage,
    setInfinityScrollIsLastPage: setIsLastPage,
    ...entity,
  };
}
