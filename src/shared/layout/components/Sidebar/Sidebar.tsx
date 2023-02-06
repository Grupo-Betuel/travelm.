import styles from './Sidebar.module.scss'
import Sider from 'antd/lib/layout/Sider'
import { useRef, useState } from 'react'
import {
  layoutId,
  navbarOptionsHeight,
  sidebarId,
} from '../../../../utils/layout.utils'
import { Affix } from 'antd'

const footerName = 'SidebarFooter'
export interface ISidebarProps {
  children?: React.ReactNode[]
}

export const Sidebar = ({ children }: ISidebarProps = { children: [] }) => {
  const sidebarRef = useRef<HTMLDivElement>()
  const [top, setTop] = useState(navbarOptionsHeight)

  const Footer = () => (
    <>
      {children?.find &&
        children?.find((item: any, i: number) => {
          const found = item.type.name === footerName
          return found
        })}
    </>
  )

  return (
    <Sider className={styles.Sidebar} ref={sidebarRef as any}>
      <Affix offsetTop={top} target={() => document.getElementById(layoutId)}>
        <div className={styles.SidebarWrapper} id={sidebarId}>
          <div className={styles.SidebarContent}>
            {children?.filter
              ? children?.filter((item: any) => item.type.name !== footerName)
              : children}
          </div>
          <Footer />
        </div>
      </Affix>
    </Sider>
  )
}
