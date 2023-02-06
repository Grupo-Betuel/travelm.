import styles from './Profile.module.scss'
import { LandingCarousel } from '@shared/components'
import { Avatar, Button, Dropdown, Rate, Tabs, TabsProps, Tooltip } from 'antd'
import { CloudUploadOutlined, UserOutlined } from '@ant-design/icons'
import { ProfilePosts } from '@screens/Profile/components'
import { ProfileReviews } from '@screens/Profile/components'

export const Profile = () => {
  const profileTabItems: TabsProps['items'] = [
    {
      key: '1',
      label: `Posts`,
      children: <ProfilePosts />,
    },
    {
      key: '2',
      label: `Reseñas`,
      children: <ProfileReviews />,
    },
    {
      key: '3',
      label: `Empleados (Revendedores Oficiales)`,
      children: `Content of Tab Pane 3`,
    },
  ]
  return (
    <div className={styles.Profile}>
      <div className={styles.ProfileHeader}>
        <div style={{ position: 'relative' }}>
          <LandingCarousel />
          <Button
            style={{ position: 'absolute', bottom: 100, right: 20, zIndex: 1 }}
            icon={<CloudUploadOutlined />}
          >
            Cambiar Portada
          </Button>
        </div>
        <div className={styles.ProfileHeaderOptionsWrapper}>
          <div className={styles.ProfileHeaderUserAbout}>
            <Dropdown
              menu={{
                items: [
                  {
                    label: 'Ver Foto',
                    key: 'watch',
                  },
                  {
                    label: 'Cambiar Foto',
                    key: 'upload',
                  },
                ],
              }}
              trigger={['click']}
              placement="bottom"
            >
              <Avatar
                className={styles.ProfileHeaderAvatar}
                size={150}
                icon={<UserOutlined />}
              />
            </Dropdown>
            <div className="d-flex-column">
              <h1 className="title">Italia Shop</h1>
              <div className="flex-start-end gap-s mb-s">
                <Rate allowHalf defaultValue={2.5} disabled />
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
      <div className={styles.ProfileContent}>
        <Tabs items={profileTabItems} />
      </div>
    </div>
  )
}
