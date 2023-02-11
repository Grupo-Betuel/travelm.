import styles from './MessagingChatBox.module.scss'
import { Avatar, Badge } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import { UserEntity } from '@shared/entities/UserEntity'

export interface IMessagingChatBoxProps {
  user?: UserEntity
}

export const MessagingChatBox = ({ user }: IMessagingChatBoxProps) => {
  const catImg =
    'https://i.pinimg.com/236x/de/7a/9f/de7a9ff45c4087284940941534d2e410--beautiful-kittens-cute-kittens.jpg'

  return (
    <div
      className={`${styles.MessagingChatBox} flex-between-center gap-s p-x-s w-100`}
    >
      <div className="d-flex gap-s">
        <Avatar
          size={52}
          src={user ? user.profile : catImg}
          className={styles.MessagingChatBoxAvatar}
        />
        <div className="d-flex-column">
          <span className="subtitle">{user ? user.name : 'Adrian Romero'}</span>
          <div className="flex-start-center gap-s">
            <b className="label text-green-5">hola Como estas?</b>
            <span className="label">4d</span>
          </div>
        </div>
      </div>
      <Badge className={styles.MessagingChatBadge} color="blue" />
      <MoreOutlined className={styles.MessagingChatMoreIcon} />
    </div>
  )
}
