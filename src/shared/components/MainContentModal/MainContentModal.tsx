import styles from './MainContentModal.module.scss'

export interface IMainContentModalProps {
  children?: any
  show?: boolean
}
export const MainContentModal = ({
  children,
  show,
}: IMainContentModalProps) => {
  return show ? (
    <div className={styles.MainContentModal}>{children}</div>
  ) : (
    <></>
  )
}
