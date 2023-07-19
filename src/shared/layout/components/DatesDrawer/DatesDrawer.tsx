import {
  Avatar,
  Badge,
  BadgeProps,
  Calendar,
  Drawer,
  DrawerProps,
  List,
  Skeleton,
} from 'antd'
import styles from './DatesDrawer.module.scss'
import { getAuthData } from '../../../../utils/auth.utils'
import { ClientEntity } from '@shared/entities/ClientEntity'
import { Dayjs } from 'dayjs'

const getListData = (value: Dayjs) => {
  let listData
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
      ]
      break
    case 10:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
        { type: 'error', content: 'This is error event.' },
      ]
      break
    case 15:
      listData = [
        { type: 'warning', content: 'This is warning event' },
        { type: 'success', content: 'This is very long usual event。。....' },
        { type: 'error', content: 'This is error event 1.' },
        { type: 'error', content: 'This is error event 2.' },
        { type: 'error', content: 'This is error event 3.' },
        { type: 'error', content: 'This is error event 4.' },
      ]
      break
    default:
  }
  return listData || []
}

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394
  }
}

export interface IDatesDrawerProps extends DrawerProps {}

export const DatesDrawer = ({ ...props }: IDatesDrawerProps) => {
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value)
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null
  }

  const authUser = getAuthData('user') as ClientEntity
  const DatesList = [
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

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value)
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge
              status={item.type as BadgeProps['status']}
              text={item.content}
            />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className={styles.DatesDrawer}>
      {authUser && <h3>{authUser.name} recuerda!</h3>}
      <Calendar
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
      />
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        dataSource={DatesList}
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
      <ul className={styles.DatesOptionsList}>
        <li className={`${styles.DatesOptionTitle}`}>Help & Setting</li>
        <li className={`${styles.DatesOption}`}>Como vender?</li>
        <li className={`${styles.DatesOption}`}>Language</li>
      </ul>
    </div>
  )
}
