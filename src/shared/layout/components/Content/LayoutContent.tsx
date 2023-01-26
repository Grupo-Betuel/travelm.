import styles from './LayoutContent.module.scss'

export interface ILayoutContentProps {
  children?: any
  className?: string
}
export const LayoutContent = ({ children, className }: ILayoutContentProps) => {
  return <div className={`${styles.Content} ${className}`}>{children}</div>
}
