import { VerticalPreviewCard } from '@shared/components'
import img from '@assets/images/logo.png'
import { useRouter } from 'next/router'
import { IVerticalPreviewCardItem } from '@components/VerticalPreviewCard/VerticalPreviewCard'

export type PostTypes = 'product' | 'vehicle' | 'real-state'

export const PostTypeSelector = () => {
  const router = useRouter()
  const postTypes: IVerticalPreviewCardItem[] = [
    {
      images: [img as string],
      title: 'Producto',
    },
    {
      images:
        ['https://www.freeiconspng.com/thumbs/car-icon-png/transport-car-icon--6.png'],
      title: 'Vehiculo',
    },
    {
      images: ['https://cdn-icons-png.flaticon.com/512/2590/2590435.png'],
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
