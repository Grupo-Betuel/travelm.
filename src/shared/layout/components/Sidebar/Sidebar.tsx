import styles from './Sidebar.module.scss'
import Sider from 'antd/lib/layout/Sider'

export interface ISidebarProps {
  children?: any
}
export const Sidebar = ({ children }: ISidebarProps) => {
  return (
    <Sider className={styles.Sidebar}>
      <div className={styles.SidebarWrapper}>
        <div className={styles.SidebarContent}>{children}</div>
      </div>
    </Sider>
  )
}
