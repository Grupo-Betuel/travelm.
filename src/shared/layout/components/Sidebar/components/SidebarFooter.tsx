import styles from './SidebarFooter.module.scss'

export interface ISidebarFooter {
  children: any
}
export const SidebarFooter = ({ children }: ISidebarFooter) => {
  return <div className={styles.SidebarFooter}>{children}</div>
}
