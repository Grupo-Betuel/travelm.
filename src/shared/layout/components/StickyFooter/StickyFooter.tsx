import styles from './StickyFooter.module.scss';

export interface IStickyFooter {
  children: any
  className?: string
}
export function StickyFooter({ children, className }: IStickyFooter) {
  return <div className={`${styles.StickyFooter} ${className}`}>{children}</div>;
}
