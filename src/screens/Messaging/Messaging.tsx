import styles from './Messaging.module.scss'
import { Sidebar } from '@shared/layout/components/Sidebar/Sidebar'
import { LayoutContent } from '@shared/layout/components/Content/LayoutContent'
import { UserEntity } from '@shared/entities/UserEntity'
import { Input, Tabs } from 'antd'
import {
  MessagingChatBox,
  MessagingConversation,
} from '@screens/Messaging/components'
export interface IMessagingProps {
  sidebarMode?: boolean
}

const botUser = {
  profile:
    'https://www.creativefabrica.com/wp-content/uploads/2019/05/Market-icon-by-ahlangraphic-12-580x386.jpg',
  name: 'Comisionate Bot',
} as UserEntity
const ChatList = () => {
  return (
    <div>
      <Input.Search placeholder="buscar" className="p-s" />
      <MessagingChatBox user={botUser} />
      <MessagingChatBox />
      <MessagingChatBox />
      <MessagingChatBox />
      <MessagingChatBox />
      <MessagingChatBox />
      <MessagingChatBox />
    </div>
  )
}

export const Messaging = ({ sidebarMode }: IMessagingProps) => {
  return (
    <LayoutContent className={styles.Messaging}>
      <Sidebar className={styles.MessagingChatsWrapper} expanded={sidebarMode}>
        <Tabs
          items={[
            {
              key: '1',
              label: 'Usuarios',
              children: <ChatList />,
            },
            {
              key: '2',
              label: 'Publicaciones',
              children: <ChatList />,
            },
          ]}
        />
      </Sidebar>
      {!sidebarMode && <MessagingConversation user={botUser} />}
    </LayoutContent>
  )
}
