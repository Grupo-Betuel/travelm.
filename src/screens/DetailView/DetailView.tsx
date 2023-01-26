import styles from './DetailView.module.scss'
import { Avatar, Button, Carousel } from 'antd'
import logo from '@assets/images/logo.png'
import { ImageBackground } from '@screens/DetailView/components/ImageBackground/ImageBackground'
import {
  MessageOutlined,
  StarFilled,
  ShareAltOutlined,
  MoreOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/router'

export interface IDetailViewProps {
  isPreview?: boolean
}
export const DetailView = ({ isPreview }: IDetailViewProps) => {
  const router = useRouter()

  const back = () => router.back()

  return (
    <div className={`grid-container ${styles.DetailViewWrapper}`}>
      <div
        className={`grid-column-${isPreview ? '2' : '3'} ${
          styles.GalleryWrapper
        }`}
      >
        <div className={styles.DetailViewBackButton}>
          <ArrowLeftOutlined onClick={back} />
        </div>
        <Carousel>
          <div>
            <ImageBackground image={logo} />
          </div>
          <div>
            <ImageBackground image={logo} />
          </div>
        </Carousel>
      </div>
      <div className={styles.DetailViewContent}>
        <div className={styles.DetailViewContentHeader}>
          <span className="title">
            Calzado Timberland del 37 al 43. Órdenes al [hidden information] ➡️
            Disponible bajo pedido.
          </span>
          <span className="subtitle">DOP 3,00 - Disponible</span>
          <span className="label">Publicado en Santo Domingo</span>
        </div>
        <div className={styles.DetailViewContentActions}>
          <Button icon={<MessageOutlined />} size="large" className="me-m">
            Mensaje
          </Button>
          <Button icon={<StarFilled />} size="large" className="me-m"></Button>
          <Button
            icon={<ShareAltOutlined />}
            size="large"
            className="me-m"
          ></Button>
          <Button icon={<MoreOutlined />} size="large"></Button>
        </div>
        <div
          className={`d-flex-column gap-xx-s ${styles.DetailViewContentInfo}`}
        >
          <span className="subtitle">Details</span>
          <div className="grid-column-fill-1">
            <span className="text-bold">Condition</span>
            <div>New</div>
          </div>
          <div className="grid-column-fill-1">
            <span className="text-bold">Modelo</span>
            <div>Sonata</div>
          </div>
        </div>
        <div className={styles.DetailViewContentDescription}>
          <p>
            Si te interesa más información ¡Por favor!Escribenos al:
            <br /> <br />
            📍📍 [hidden information]
            <br /> <br />
            Mercancía 100% extranjera.
          </p>
        </div>
        <div className={styles.DetailViewContentLocation}>
          <Button type="primary">Primary Button</Button>
        </div>
        <div className={styles.DetailViewContentSellerInfo}>
          <span className="subtitle mb-xx-s">Seller Information</span>
          <div className="flex-align-center gap-s">
            <Avatar size="large" icon={<UserOutlined />} />
            <span className="text-bold">User Name</span>
          </div>
        </div>
      </div>
    </div>
  )
}
