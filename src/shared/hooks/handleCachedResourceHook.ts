import { useEffect } from 'react';
import { ICachedResourceResponse } from '../../utils/server-side.utils';

export function handleCachedResourceHook<T>(cachedResources: ICachedResourceResponse<T>) {
  useEffect(() => {
    if (cachedResources?.error) {
      if (cachedResources?.error?.status === 404) {
        location.href = '/';
      }
    }
  }, [cachedResources?.error]);
}
