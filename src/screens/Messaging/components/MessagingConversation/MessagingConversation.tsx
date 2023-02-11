import styles from './MessagingConversation.module.scss'
import { UserEntity } from '@shared/entities/UserEntity'
import { Sidebar } from '@shared/layout/components/Sidebar/Sidebar'
import { Avatar } from 'antd'
import {
  FacebookOutlined,
  SearchOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { MessagingMessage } from '@screens/Messaging/components/MessagingMessage/MessagingMessage'

export interface IMessagingConversationBoxProps {
  user: UserEntity
}

export const MessagingConversation = ({
  user,
}: IMessagingConversationBoxProps) => {
  const catImg =
    'https://i.pinimg.com/236x/de/7a/9f/de7a9ff45c4087284940941534d2e410--beautiful-kittens-cute-kittens.jpg'

  return (
    <div className={styles.MessagingConversationWrapper}>
      <div className={styles.MessagingConversation}>
        <div className="flex-column-center-center w-100">
          <Avatar
            size={52}
            src={user ? user.profile : catImg}
            className={styles.MessagingChatBoxAvatar}
          />
          <b className="subtitle">Danel Vargas</b>
          <span className="label">
            Usuario | Tienda | Vendedor | Revendedor
          </span>
        </div>
        <div className="d-flex-column w-100">
          <MessagingMessage text="Hola" />
          <MessagingMessage text="Hola" isFrom />
          <MessagingMessage text="Hola" />
        </div>
      </div>
      <Sidebar className={styles.MessagingConversationUserInfo}>
        <div className="flex-column-center-center w-100">
          <Avatar
            size={52}
            src={user ? user.profile : catImg}
            className={styles.MessagingConversationUserAvatar}
          />
          <b className="subtitle">Danel Vargas</b>
          <span className="label">Activo hace 2 horas</span>
        </div>
        <div
          className={`${styles.MessagingConversationUserInfoActions} mt-s flex-center-center gap-s`}
        >
          <div className="flex-column-center-center">
            <FacebookOutlined
              className={styles.MessagingConversationUserInfoActionsIcon}
            />
            <span className="font-size-3 mt-x-s">Facebook</span>
          </div>
          <div className="flex-column-center-center">
            <WarningOutlined
              className={styles.MessagingConversationUserInfoActionsIcon}
            />
            <span className="font-size-3 mt-x-s">Reportar</span>
          </div>
          <div className="flex-column-center-center">
            <SearchOutlined
              className={styles.MessagingConversationUserInfoActionsIcon}
            />
            <span className="font-size-3 mt-x-s">Buscar</span>
          </div>
        </div>
        <h2>Privacidad y soporte</h2>
      </Sidebar>
    </div>
  )
}
