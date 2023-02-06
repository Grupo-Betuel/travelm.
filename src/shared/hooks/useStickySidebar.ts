import { useCallback, useEffect, useState } from 'react'
import {
  layoutId,
  navbarSubOptionsHeight,
  sidebarId,
} from '../../utils/layout.utils'

export interface IUseStickySidebarData {
  isSticky?: boolean
}
export interface IUseStickySidebarProps {
  useSidebarWrapper?: boolean
}

export const useStickySidebar = ({
  useSidebarWrapper,
}: IUseStickySidebarProps): IUseStickySidebarData => {
  const [isSticky, setIsSticky] = useState(false)

  const onScroll = useCallback((event: any) => {
    const appSidebar = document.getElementById(sidebarId) as HTMLElement
    if (!appSidebar) return
    const appLayout = document.getElementById(layoutId) as HTMLElement
    const sidebarWrapperElement = (appSidebar.parentElement as HTMLElement)
      .parentElement as HTMLElement
    const appSidebarParent = useSidebarWrapper
      ? sidebarWrapperElement
      : (sidebarWrapperElement.offsetParent as HTMLElement) ||
        (sidebarWrapperElement as HTMLElement)

    const { scrollTop } = appLayout
    const reachTop =
      scrollTop >= appSidebarParent.offsetTop + navbarSubOptionsHeight
    if (reachTop) {
      appSidebar.style.position = 'fixed'
    } else {
      appSidebar.style.position = ''
    }
    setIsSticky(reachTop)
  }, [])

  useEffect(() => {
    document.getElementById(layoutId)?.addEventListener('scroll', onScroll)
    return () => {
      document.getElementById(layoutId)?.removeEventListener('scroll', onScroll)
    }
  }, [])

  return { isSticky }
}
