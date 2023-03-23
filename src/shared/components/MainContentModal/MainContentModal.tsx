import { AppViewportHeightContext } from '@shared/contexts/AppViewportHeightContext'
import { Affix } from 'antd'
import { useContext, useState } from 'react'
import { layoutId, navbarOptionsHeight } from 'src/utils/layout.utils'
import styles from './MainContentModal.module.scss'

export interface IMainContentModalProps {
  children?: any
  show?: boolean
}
export const MainContentModal = ({
  children,
  show,
}: IMainContentModalProps) => {
  const [top, setTop] = useState(navbarOptionsHeight)
  const [enableSidebarOptionHiddenHeight, setEnableSidebarOptionHiddenHeight] =
    useState<boolean>()

  const appViewportHeight = useContext(AppViewportHeightContext)

  return show ? (
    <div
      className={`${styles.MainContentModal} ${appViewportHeight.appViewportHeightClassName}`}
    >
      {children}
    </div>
  ) : (
    <></>
  )
}
