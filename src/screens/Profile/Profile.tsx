import styles from './Profile.module.scss'
import { LandingCarousel } from '@shared/components'
import { Avatar, Button, Rate, Tooltip } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Search } from '@screens/Search'

export const Profile = () => {
  return (
    <div className={styles.Profile}>
      <div className={styles.ProfileHeader}>
        <LandingCarousel />
        <div className={styles.ProfileHeaderOptionsWrapper}>
          <div className={styles.ProfileHeaderUserAbout}>
            <Avatar
              className={styles.ProfileHeaderAvatar}
              size={150}
              icon={<UserOutlined />}
            />
            <div className="d-flex-column">
              <h1 className="title">Italia Shop</h1>
              <div className="flex-start-end gap-s mb-s">
                <Rate allowHalf defaultValue={2.5} />
                <span>3K Seguidores</span>
              </div>
              <div className="flex-start-center gap-s">
                <Avatar.Group>
                  <Tooltip title="Ant User 2" placement="top">
                    <Avatar
                      size="large"
                      src="https://images.unsplash.com/photo-1587723958656-ee042cc565a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0JTIwcHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
                    />
                  </Tooltip>
                  <Tooltip title="Ant User 4" placement="top">
                    <Avatar
                      size="large"
                      src="https://cdn.pixabay.com/photo/2020/10/05/10/51/cat-5628953__480.jpg"
                    />
                  </Tooltip>
                  <Tooltip title="Ant User 5" placement="top">
                    <Avatar
                      size="large"
                      src="https://cdn.pixabay.com/photo/2021/01/22/14/24/cat-5940106__340.jpg"
                    />
                  </Tooltip>
                </Avatar.Group>
                <span className="app-subtitle">3 Revendedores Oficiales</span>
              </div>
            </div>
          </div>
          <div className={styles.ProfileHeaderActions}>
            <Button>Seguir</Button>
            <Button>Mensaje</Button>
          </div>
        </div>
      </div>
      <Search />
    </div>
  )
}
