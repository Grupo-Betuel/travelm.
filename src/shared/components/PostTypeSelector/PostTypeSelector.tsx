import { VerticalPreviewCard } from '@components/VerticalPreviewCard'
import { IVerticalPreviewCardItem } from '@components/VerticalPreviewCard/VerticalPreviewCard'
import img from '@assets/images/logo.png'
import { useRouter } from 'next/router'

export type PostTypes = 'product' | 'vehicle' | 'real-state'

export const PostTypeSelector = () => {
  const router = useRouter()
  const postTypes: IVerticalPreviewCardItem[] = [
    {
      image: img,
      title: 'Producto',
    },
    {
      image:
        'https://www.freeiconspng.com/thumbs/car-icon-png/transport-car-icon--6.png',
      title: 'Vehiculo',
    },
    {
      image: 'https://cdn-icons-png.flaticon.com/512/2590/2590435.png',
      title: 'Bienes Raices',
    },
  ]

  const onSelectPostType = (type: PostTypes) => () => {
    router.push(`/post/${type}`)
  }
  return (
    <div className="grid-container w-100 p-l">
      <VerticalPreviewCard
        items={[postTypes[0]]}
        onSelect={onSelectPostType('product')}
      />
      <VerticalPreviewCard
        items={[postTypes[1]]}
        onSelect={onSelectPostType('vehicle')}
      />
      <VerticalPreviewCard
        items={[postTypes[2]]}
        onSelect={onSelectPostType('real-state')}
      />
    </div>
  )
}
