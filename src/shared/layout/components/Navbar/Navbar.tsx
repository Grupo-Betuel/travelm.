import { Header } from 'antd/lib/layout/layout'
import Image from 'next/image'
import styles from './Navbar.module.scss'
import {
  AutoComplete,
  Button,
  Dropdown,
  Input,
  Select,
} from 'antd'
import Link from 'next/link'
import {
  BellOutlined,
  UserOutlined,
  MessageOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import { HandleAuthVisibility } from '@shared/components'

const { Option } = Select

export interface ICategorySelect {
  onSelect: (slug: string) => void
}

export const Navbar = () => {

  return (
    <>
      <Header className={styles.navbar}>
        <div
          className={`grid-container grid-column-full px-xx-l ${styles.navbarOptionsWrapper}`}
        >
          <div className={`${styles.navbarLogoContainer} flex-start-center`}>
            <div className="cursor-pointer">
              <img src={"https://assets.stickpng.com/images/58482d7fcef1014c0b5e4a5a.png"} />
            </div>
          </div>
          <div className={`${styles.navbarBrowserWrapper} flex-center-center`}>
            <AutoComplete
              style={{ width: '100%' }}
              filterOption={true}
            >
              <Input.Search

                size="large"
                allowClear
                placeholder="Messaging"
              />
            </AutoComplete>
          </div>
          <div className={`${styles.navbarOptionsList} flex-end-center`}>
            <HandleAuthVisibility
              visibleOn="no-auth"
              className={styles.navbarOptionsListItem}
            >
              <div>Iniciar Session</div>
            </HandleAuthVisibility>
            <div className={styles.navbarOptionsListItem}>
              <Link href="/post">
                <Button type="default">Publicar</Button>
              </Link>
            </div>
            <HandleAuthVisibility
              visibleOn="auth"
              className={styles.navbarOptionsListItem}
            >
              <div className={styles.userDropdown}>
                <Dropdown
                  trigger={['click']}
                  placement="bottom"
                >
                  <UserOutlined className={styles.navbarIconOption} />
                </Dropdown>
              </div>
            </HandleAuthVisibility>
            <HandleAuthVisibility
              visibleOn="auth"
              className={styles.navbarOptionsListItem}
            >
              <BellOutlined
                className={styles.navbarIconOption}
              />
            </HandleAuthVisibility>
            <HandleAuthVisibility
              visibleOn="auth"
              className={styles.navbarOptionsListItem}
            >
              <MessageOutlined
                className={styles.navbarIconOption}
              />
            </HandleAuthVisibility>
            <HandleAuthVisibility
              visibleOn="auth"
              className={styles.navbarOptionsListItem}
            >
              <CalendarOutlined
                className={styles.navbarIconOption}
              />
            </HandleAuthVisibility>
          </div>
        </div>
      </Header>
    </>
  )
}
