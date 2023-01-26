import type { NextPage } from 'next'
import { Sidebar } from '@shared/layout/components/Sidebar/Sidebar'

const ProductPage: NextPage = () => {
  return (
    <div>
      <Sidebar />
      <h1>Product Page</h1>
    </div>
  )
}

export default ProductPage
