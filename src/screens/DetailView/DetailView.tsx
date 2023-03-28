import styles from './DetailView.module.scss'
import { Avatar, Button, Carousel, Image, Input, List, Space } from 'antd'
import { ImageBackground } from '@screens/DetailView/components/ImageBackground/ImageBackground'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LikeOutlined,
  MessageOutlined,
  MoreOutlined,
  ShareAltOutlined,
  StarFilled,
  StarOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import { PostEntity } from '@shared/entities/PostEntity'
import { createElement, useEffect, useRef, useState } from 'react'
import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import { Resizable } from 're-resizable'
import { sidebarWidth } from '../../utils/layout.utils'
import { StickyFooter } from '@shared/layout/components/StickyFooter/StickyFooter'
import { useContextualRouting } from 'next-use-contextual-routing'
import { ViewEntity } from '@shared/entities/ViewEntity'
import { VIEW_CONSTRAINTS } from '@shared/enums/view.enum'
import { getAuthData } from 'src/utils/auth.utils'
import { UserEntity } from '@shared/entities/UserEntity'
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum'

export interface IDetailViewProps {
  previewPost?: PostEntity
  selectedPost?: PostEntity
  returnHref?: string
}

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {createElement(icon)}
    {text}
  </Space>
)

const data = Array.from({ length: 23 }).map((_, i) => ({
  href: 'https://ant.design',
  title: `Juan Felipe ${i}`,
  avatar:
    'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-cat-photos-1593441022.jpg?crop=0.670xw:1.00xh;0.167xw,0&resize=640:*',
  description: 'Revendedor | Tienda | Vendedor Oficial',
  content:
    'Me Encanto la tabla de surf que compre, de muy buena calidad, excelente servicios',
}))

export const DetailView = ({
  previewPost,
  selectedPost,
  returnHref,
}: IDetailViewProps) => {
  const router = useRouter()
  const [post, setPost] = useState<PostEntity>({
    ...previewPost,
    ...selectedPost,
  } as PostEntity)
  const carouselRef = useRef<any>()
  const { get, item } = handleEntityHook<PostEntity>('posts')
  const { add: addView } = handleEntityHook<ViewEntity>('views')
  const [addViewTimeout, setAddViewTimeout] = useState<NodeJS.Timeout>()
  const { makeContextualHref } = useContextualRouting()
  const authUser = getAuthData('user') as UserEntity

  useEffect(() => {
    if (previewPost) return
    const viewTimeout = setTimeout(() => {
      handleAddView()
    }, VIEW_CONSTRAINTS.TIMEOUT_LIMIT)
    setAddViewTimeout(viewTimeout)

    return () => clearTimeout(viewTimeout)
  }, [])

  useEffect(() => {
    setPost({ ...item, ...previewPost, ...selectedPost } as PostEntity)
  }, [previewPost, item, selectedPost])

  useEffect(() => {
    const slug = router.query.slug as string
    if (slug) {
      get({ slug })
    }
  }, [router.query])

  const handleAddView = () => {
    if (!authUser._id || authUser._id === post.userId) return
    addView(
      {
        postId: post._id as string,
        userId: authUser._id,
        postTitle: post.title,
        subCategoryId: post.subCategoryId || 'example',
      },
      { endpoint: EndpointsAndEntityStateKeys.CREATE }
    )
  }
  const back = () => {
    console.log('returnHref', returnHref)
    if (returnHref) {
      router.push(makeContextualHref({ return: true, slug: '' }), returnHref, {
        shallow: true,
      })
    } else {
      router.back()
    }
  }

  const navigate = (to: 'prev' | 'next') => () =>
    carouselRef.current && carouselRef.current[to]()
  const hasImages = post.images && !!post.images.length
  const hasMultipleImages = hasImages && post.images.length > 1

  return (
    <div className={`grid-container ${styles.DetailViewWrapper}`}>
      <div className={`grid-column-1 ${styles.GalleryWrapper}`}>
        {!previewPost && (
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
              post.images.map((img, i) => (
                <ImageBackground image={img} key={`detailViewImage${i}`} />
              ))
            ) : (
              <ImageBackground />
            )}
          </Carousel>
        </Image.PreviewGroup>
      </div>
      <Resizable
        defaultSize={{ width: sidebarWidth, height: 'auto' }}
        enable={{ left: true, right: false }}
        className={styles.DetailViewPostDetails}
      >
        <div className={styles.DetailViewPostDetailsHeader}>
          <span className="title">{post.title}</span>
          <span className="subtitle">DOP {post.price} - Disponible</span>
          <span className="label">Publicado en Santo Domingo</span>
          <div className={styles.DetailViewPostDetailsActions}>
            <Button icon={<MessageOutlined />} size="large" className="me-m">
              Mensaje
            </Button>
            <Button
              icon={<StarFilled />}
              size="large"
              className="me-m"
            ></Button>
            <Button
              icon={<ShareAltOutlined />}
              size="large"
              className="me-m"
            ></Button>
            <Button icon={<MoreOutlined />} size="large"></Button>
          </div>
        </div>
        <div className={styles.DetailViewPostDetailsContent}>
          <div
            className={`d-flex-column gap-xx-s ${styles.DetailViewPostDetailsContentInfo}`}
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
          <div className={styles.DetailViewPostDetailsContentDescription}>
            <p>
              Si te interesa más información ¡Por favor!Escribenos al:
              <br /> <br />
              📍📍 [hidden information]
              <br /> <br />
              Mercancía 100% extranjera.
            </p>
          </div>
          <div className={styles.DetailViewPostDetailsContentLocation}>
            <Button type="primary">Primary Button</Button>
          </div>
          <div className={styles.DetailViewPostDetailsContentSellerInfo}>
            <span className="subtitle mb-xx-s">Seller Information</span>
            <div className="flex-align-center gap-s">
              <Avatar size="large" icon={<UserOutlined />} />
              <span className="text-bold">User Name</span>
            </div>
          </div>

          <div className={styles.DetailViewPostDetailsContentComments}>
            <span className="subtitle mb-xx-s">Comentarios</span>

            <List
              itemLayout="vertical"
              size="large"
              dataSource={data}
              footer={
                <div>
                  <b>ant design</b> footer part
                </div>
              }
              renderItem={(item) => (
                <List.Item
                  key={item.title}
                  actions={[
                    <IconText
                      icon={StarOutlined}
                      text="156"
                      key="list-vertical-star-o"
                    />,
                    <IconText
                      icon={LikeOutlined}
                      text="156"
                      key="list-vertical-like-o"
                    />,
                    <IconText
                      icon={MessageOutlined}
                      text="2"
                      key="list-vertical-message"
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.description}
                  />
                  {item.content}
                </List.Item>
              )}
            />
          </div>
        </div>
        <StickyFooter className="flex-between-center p-m gap-s">
          <Input
            placeholder="Escribir comentario"
            suffix={<UploadOutlined />}
          />
          <Button icon={<MessageOutlined />}>Enviar</Button>
        </StickyFooter>
      </Resizable>
    </div>
  )
}
