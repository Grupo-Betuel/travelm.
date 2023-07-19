import styles from './Company.module.scss'
import { getAuthData } from 'src/utils/auth.utils'
import { ClientEntity } from '@shared/entities/ClientEntity'
import {
  LandingCarousel,
  MainContentModal,
  ProductCard,
  ScrollView,
} from '@shared/components'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import { ProductEntity } from '@shared/entities/ProductEntity'
import { useEffect, useState, useMemo, ChangeEvent } from 'react'
import { useRouter } from 'next/router'
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum'
import Link from 'next/link'
import { useContextualRouting } from 'next-use-contextual-routing'
import { DetailView } from '@components/DetailView'
import { deepMatch } from '../../utils/matching.util'

export interface CompanyProps {
  hideCarousel?: boolean
}
export type ProductPerCategoryType = {
  [N in string]: {
    products: ProductEntity[]
    title: string
  }
}

export const Company = ({ hideCarousel }: CompanyProps) => {
  const authClient = getAuthData('all') as ClientEntity
  const router = useRouter()
  const { makeContextualHref, returnHref } = useContextualRouting()
  const [companyName, setCompanyName] = useState<string>()
  const [companyProducts, setCompanyProducts] = useState<ProductEntity[]>([])
  const [showContextProductDetailModal, setShowContextProductDetailModal] =
    useState<boolean>()
  const { get: getProducts, ['by-company']: companyProductsData } =
    handleEntityHook<ProductEntity>('products')

  const productsPerCategories = useMemo<ProductPerCategoryType>(() => {
    const data = companyProducts.reduce<ProductPerCategoryType>(
      (acc, product) => {
        const category = product.category?._id || 'default'

        if (!acc[category]) {
          acc[category] = {
            products: [],
            title: product.category?.title || 'Mas Productos',
          }
        }
        acc[category].products.push(product)
        return acc
      },
      {}
    )
    return data || {}
  }, [companyProducts])

  useEffect(() => {
    const company = router.query.company as string
    const productId = router.query.productId as string

    if (company && !companyProductsData?.data?.length) {
      getProducts({
        endpoint: EndpointsAndEntityStateKeys.BY_COMPANY,
        slug: company,
      })
      setCompanyName(company)
    }

    setShowContextProductDetailModal(!!productId)
  }, [router.query])

  useEffect(() => {
    setCompanyProducts(companyProductsData?.data || [])
  }, [companyProductsData?.data])

  const goToProductDetail = (product: ProductEntity) => {
    router.push(
      makeContextualHref({ productId: product._id }),
      `/detail/${product._id}`,
      {
        shallow: true,
      }
    )
  }
  const handleSeeMore = (product: ProductEntity) => {
    router.push(`/category/${product.category._id}`)
  }

  const onSearch = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    const results = deepMatch<ProductEntity>(
      value,
      companyProductsData?.data || []
    )
    setCompanyProducts([...results])
  }

  return (
    <div className={styles.CompanyWrapper}>
      <MainContentModal show={showContextProductDetailModal}>
        <DetailView returnHref={returnHref}></DetailView>
      </MainContentModal>
      <div className={styles.LandingCarouselWrapper}>
        {!hideCarousel && <LandingCarousel />}
      </div>
      <div className={styles.CompanyContent}>
        <div className={styles.CompanySearchWrapper}>
          <Input
            className={styles.CompanyInputSearch}
            placeholder="Buscar"
            suffix={<SearchOutlined className="site-form-item-icon" />}
            bordered={false}
            onChange={onSearch}
            size="large"
          />
        </div>
        {companyProducts.length > 0 ? (
          <div className={styles.CompanyContentProducts}>
            {Object.keys(productsPerCategories).map((categoryId, i) => {
              const category = productsPerCategories[categoryId]
              return (
                <ScrollView
                  key={`scroll-view-category-${i}`}
                  wrapperClassName={
                    styles.CompanyContentProductsScrollViewCategories
                  }
                  handleSeeMore={handleSeeMore}
                  handleProductClick={goToProductDetail}
                  products={category.products}
                  title={category.title}
                />
              )
            })}
            <h2 className="mb-xx-l title">Todos los Productos</h2>
            <div className={styles.CompanyCardsGrid}>
              {companyProducts.map((item, i) => (
                <ProductCard
                  key={`product-${i}`}
                  onClick={goToProductDetail}
                  product={item}
                />
              ))}
            </div>
          </div>
        ) : (
          <h2>No hay resultados!</h2>
        )}
      </div>
    </div>
  )
}
