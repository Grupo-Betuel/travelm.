import { Avatar, Drawer, DrawerProps, List, Skeleton } from 'antd'
import styles from './NotificationDrawer.module.scss'
import { getAuthData } from '../../../../utils/auth.utils'
import { UserEntity } from '@shared/entities/UserEntity'

export interface INotificationDrawerProps extends DrawerProps {}

export const NotificationDrawer = ({ ...props }: INotificationDrawerProps) => {
  const authUser = getAuthData('user') as UserEntity
  const notificationList = [
    {
      loading: false,
      picture:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/640px-Cat03.jpg',
      name: 'Meeting with cat on Monday at 4:00PM',
    },
    {
      loading: true,
      picture:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/640px-Cat03.jpg',
      name: 'Meeting with cat on Monday at 4:00PM',
    },
  ]
  const initLoading = false

  return (
    <div className={styles.NotificationDrawer}>
      {authUser && <h3>{authUser.name} recuerda!</h3>}
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        dataSource={notificationList}
        renderItem={(item) => (
          <List.Item
            actions={[
              <a key="list-loadmore-edit">edit</a>,
              <a key="list-loadmore-more">more</a>,
            ]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={<Avatar src={item.picture} />}
                title={<a href="https://ant.design">{item.name}</a>}
                description="Diego"
              />
              <div>Content</div>
            </Skeleton>
          </List.Item>
        )}
      />
      <ul className={styles.NotificationOptionsList}>
        <li className={`${styles.NotificationOptionTitle}`}>Help & Setting</li>
        <li className={`${styles.NotificationOption}`}>Como vender?</li>
        <li className={`${styles.NotificationOption}`}>Language</li>
      </ul>
    </div>
  )
}
