import styles from './MessagingMessage.module.scss'

export interface IMessagingMessageProps {
  text: string
  isFrom?: boolean
}

export const MessagingMessage = ({ text, isFrom }: IMessagingMessageProps) => {
  return (
    <div className={`${styles.Message} ${isFrom ? styles.MessageFrom : ''}`}>
      {text}
    </div>
  )
}
