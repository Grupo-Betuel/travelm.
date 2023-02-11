import styles from './Sidebar.module.scss'
import Sider from 'antd/lib/layout/Sider'
import { useRef, useState } from 'react'
import {
  layoutId,
  navbarOptionsHeight,
  sidebarId,
} from '../../../../utils/layout.utils'
import { Affix } from 'antd'

const footerName = 'StickyFooter'
export interface ISidebarProps {
  children?: any
  className?: string
}

export const Sidebar = (
  { children, className }: ISidebarProps = { children: [] }
) => {
  const sidebarRef = useRef<HTMLDivElement>()
  const [top, setTop] = useState(navbarOptionsHeight)

  const SidebarFooter = () => (
    <>
      {children?.find &&
        children?.find((item: any, i: number) => {
          const found = item.type.name === footerName
          return found
        })}
    </>
  )

  return (
    <Sider className={`${styles.Sidebar}`} ref={sidebarRef as any}>
      <Affix
        className={styles.SidebarAffix}
        offsetTop={top}
        target={() => document.getElementById(layoutId)}
      >
        <div className={`${className} ${styles.SidebarWrapper}`} id={sidebarId}>
          <div className={styles.SidebarContent}>
            {children?.filter
              ? children?.filter((item: any) => item.type.name !== footerName)
              : children}
          </div>
          <SidebarFooter />
        </div>
      </Affix>
    </Sider>
  )
}
