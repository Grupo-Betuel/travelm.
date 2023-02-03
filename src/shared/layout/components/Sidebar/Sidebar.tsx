import styles from './Sidebar.module.scss'
import Sider from 'antd/lib/layout/Sider'
import { useRef } from 'react'
import { sidebarId } from '../../../../utils/layout.utils'
import { useStickySidebar } from '@shared/hooks/useStickySidebar'

const footerName = 'SidebarFooter'
export interface ISidebarProps {
  children?: React.ReactNode[]
}
export const Sidebar = ({ children }: ISidebarProps = { children: [] }) => {
  const { isSticky } = useStickySidebar()
  const sidebarRef = useRef<HTMLDivElement>()
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
    <Sider className={styles.Sidebar}>
      <div
        className={styles.SidebarWrapper}
        ref={sidebarRef as any}
        id={sidebarId}
      >
        <div className={styles.SidebarContent}>
          {children?.filter
            ? children?.filter((item: any) => item.type.name !== footerName)
            : children}
        </div>
      </div>
      <Footer />
    </Sider>
  )
}
