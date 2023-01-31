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
  const { data, get } = handleEntityHook<PostEntity>('posts', false)

  useEffect(() => {
    console.log('query!!', router.query)
    getPosts()
  }, [router.query])

  const getPosts = () => {
    const searchPath = ((router.query.searchPath as string[]) || []).join(',')
    const extraPath = router.query.extraPath as string
    console.log('searchPath => ', searchPath, 'pathValues', extraPath)
    const queryParams = { ...router.query }
    delete queryParams.searchPath
    delete queryParams.extraPath
    if (isNotEmptyObject(router.query)) {
      get({ endpoint: searchPath || extraPath, queryParams })
    }
  }

  return { posts: data }
}
