import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import { PostEntity } from '@shared/entities/PostEntity'
import { useRouter } from 'next/router'
import { isNotEmptyObject } from '../../utils/matching.util'
import { useEffect } from 'react'
export interface IHandleSearchPostHookData {
  posts: PostEntity[]
}

export const handleSearchPostHook = (): IHandleSearchPostHookData => {
  const router = useRouter()
  const { data, get } = handleEntityHook<PostEntity>('posts', false, {}, 600)

  useEffect(() => {
    getPosts()
  }, [router.query])

  const getPosts = () => {
    const searchPath = ((router.query.searchPath as string[]) || []).join(',')
    const extraPath = router.query.extraPath as string
    const queryParams = { ...router.query }
    delete queryParams.searchPath
    delete queryParams.extraPath
    if (isNotEmptyObject(router.query)) {
      get({ endpoint: searchPath || extraPath, queryParams })
    }
  }

  return { posts: data }
}
