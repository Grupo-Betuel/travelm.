import { Avatar, Button, Card, Image, Input, List, Rate, Space } from 'antd'
import { createElement } from 'react'
import {
  CheckCircleOutlined,
  FileImageOutlined,
  LikeOutlined,
  MessageOutlined,
  SendOutlined,
  StarOutlined,
} from '@ant-design/icons'
import styles from './ProfileReviews.module.scss'

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

export const ProfileReviews = () => {
  return (
    <div className={styles.ProfileReview}>
      <div className={styles.ProfileReviewRating}>
        <div className="d-flex-column">
          <Rate allowHalf defaultValue={0} />
          <Input placeholder="Escribe un comentario"></Input>
          <Button icon={<FileImageOutlined />}>Subir imagen</Button>
        </div>
        <SendOutlined />
      </div>
      <div className="flex-start-center gap-l">
        <Card>
          <div className="flex-column-around-center h-100">
            <CheckCircleOutlined style={{ fontSize: '40px' }} />
            <span className="subtitle">Puntualidad</span>
          </div>
        </Card>
        <Card>
          <div className="flex-column-around-center h-100">
            <CheckCircleOutlined style={{ fontSize: '40px' }} />
            <span className="subtitle">Calidad</span>
          </div>
        </Card>
        <Card>
          <div className="flex-column-around-center h-100">
            <CheckCircleOutlined style={{ fontSize: '40px' }} />
            <span className="subtitle">Atencion</span>
          </div>
        </Card>
        <Card>
          <div className="flex-column-around-center h-100">
            <CheckCircleOutlined style={{ fontSize: '40px' }} />
            <span className="subtitle">Respeto</span>
          </div>
        </Card>
      </div>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page)
          },
          pageSize: 3,
        }}
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
            extra={
              <Image
                width={272}
                alt="logo"
                src="https://cloudfront-eu-central-1.images.arcpublishing.com/prisaradio/BB3LU3SWF5LIPIIZFBSWFEW6TM.jpg"
              />
            }
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
  )
}
