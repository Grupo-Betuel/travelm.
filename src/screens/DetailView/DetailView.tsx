import styles from './DetailView.module.scss'
import { Avatar, Button, Carousel, Image } from 'antd'
import { ImageBackground } from '@screens/DetailView/components/ImageBackground/ImageBackground'
import {
  MessageOutlined,
  StarFilled,
  ShareAltOutlined,
  MoreOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import { PostEntity } from '@shared/entities/PostEntity'
import { useEffect, useRef, useState } from 'react'
import { CarouselRef } from 'antd/es/carousel'

export interface IDetailViewProps {
  previewItem?: PostEntity
}

export const DetailView = ({ previewItem }: IDetailViewProps) => {
  const [post, setPost] = useState<PostEntity>({ ...previewItem } as PostEntity)

  const carouselRef = useRef<CarouselRef>()

  useEffect(() => {
    setPost({ ...previewItem } as PostEntity)
  }, [previewItem])

  const router = useRouter()
  const back = () => router.back()
  const navigate = (to: 'prev' | 'next') => () =>
    carouselRef.current && carouselRef.current[to]()
  const hasImages = post.images && !!post.images.length
  const hasMultipleImages = hasImages && post.images.length > 1

  return (
    <div className={`grid-container ${styles.DetailViewWrapper}`}>
      <div
        className={`grid-column-${previewItem ? '1' : '1'} ${
          styles.GalleryWrapper
        }`}
      >
        {!previewItem && (
          <div className={styles.DetailViewBackButton}>
            <ArrowLeftOutlined onClick={back} />
          </div>
        )}
        {hasMultipleImages && (
          <>
            <div className={styles.DetailViewPrevButton}>
              <ArrowLeftOutlined onClick={navigate('prev')} />
            </div>
            <div className={styles.DetailViewNextButton}>
              <ArrowRightOutlined onClick={navigate('next')} />
            </div>
          </>
        )}
        <Image.PreviewGroup>
          <Carousel
            ref={carouselRef}
            nextArrow={
              <div className={styles.DetailViewButton}>
                <ArrowRightOutlined />
              </div>
            }
          >
            {hasImages ? (
              post.images.map((img) => <ImageBackground image={img} />)
            ) : (
              <ImageBackground />
            )}
          </Carousel>
        </Image.PreviewGroup>
      </div>
      <div className={styles.DetailViewContent}>
        <div className={styles.DetailViewContentHeader}>
          <span className="title">{post.title}</span>
          <span className="subtitle">DOP {post.price} - Disponible</span>
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
