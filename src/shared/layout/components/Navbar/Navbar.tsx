import { Header } from 'antd/lib/layout/layout'
import styles from './Navbar.module.scss'
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Menu,
  MenuProps,
  Modal,
  Select,
  Space,
} from 'antd'
import {
  ArrowLeftOutlined,
  BankOutlined,
  CloseOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  DownOutlined,
  FileOutlined,
  HomeOutlined,
  PieChartOutlined,
  RollbackOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { HandleAuthVisibility } from '@shared/components'
import { useContextualRouting } from 'next-use-contextual-routing'
import { Auth } from '@screens/Auth/Auth'
import {
  appLogOut,
  getAuthData,
  resetAuthData,
} from '../../../../utils/auth.utils'
import { ClientEntity } from '@shared/entities/ClientEntity'
import { ShoppingCartDrawer } from 'src/shared/components/ShoppingCartDrawer'
import React, { useEffect, useMemo, useState } from 'react'
import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import { ProductEntity } from '@shared/entities/ProductEntity'
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum'
import { CategoryEntity } from '@shared/entities/CategoryEntity'
import { MenuItemType } from 'antd/es/menu/hooks/useItems'
import Link from 'next/link'
import { useAuthClientHook } from '@shared/hooks/useAuthClientHook'
import { CompanyEntity } from '@shared/entities/CompanyEntity'
import { useRouter } from 'next/router'
import { useOrderContext } from '@shared/contexts/OrderContext'
import { useAppStore } from '@services/store'
import Sider from 'antd/lib/layout/Sider'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [
    getItem('Team 1', '6'),
    getItem('Team 2', '8'),
  ]),
  getItem('Files', '9', <FileOutlined />),
]

export interface ICategorySelect {
  onSelect: (slug: string) => void
}
const navbarOptionsLimit = 4

export const Navbar = () => {
  const [companyName, setCompanyName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [showSidebar, setHideSidebar] = useState(true)
  const router = useRouter()
  const { makeContextualHref, returnHref } = useContextualRouting()
  const authIsEnable = router.query.auth
  const {
    get: getCategories,
    [EndpointsAndEntityStateKeys.BY_COMPANY]: companyCategories,
  } = handleEntityHook<CategoryEntity>('categories')

  const { data: companies } = handleEntityHook<CompanyEntity>('companies', true)
  const [navbarOptions, setNavbarOptions] = useState<MenuItemType[]>([])
  const { client } = useAuthClientHook()
  const [selectedCompanies, setSelectedCompanies] = useState<CompanyEntity[]>(
    []
  )
  const salesQuantityData = useAppStore((state) => {
    return state.currentOrder?.sales.reduce((acc, sale) => {
      return acc + sale.quantity
    }, 0)
  })

  const [salesQuantity, setSalesQuantity] = useState(0)

  useEffect(() => {
    if (salesQuantityData) {
      setSalesQuantity(salesQuantityData)
    }
  }, [salesQuantityData])

  const { cartIsOpen, toggleCart } = useOrderContext()

  useEffect(() => {
    const company = router.query.company as string
    const category = router.query.category as string
    if (!categoryId && category) {
      setCategoryId(category)
    }
    // getting categories per company
    if (company && !companyName) {
      getCategories({
        endpoint: EndpointsAndEntityStateKeys.BY_COMPANY,
        slug: company,
      })
    }
    setCompanyName(company)
  }, [router.query])

  useEffect(() => {
    let data = []
    if (companyName) {
      data = parseCatToMenuItem(companyCategories?.data || [])
    } else {
      data = parseCompaniesToMenuItem(companies || [])
    }
    const company = companies.find((c) => c.companyId === companyName)
    company ? setSelectedCompanies([company]) : setSelectedCompanies([])

    setNavbarOptions(data)
  }, [companies, companyCategories?.data, companyName])

  const parseCatToMenuItem = (cats: CategoryEntity[]) =>
    cats.map((cat) => ({
      key: cat._id,
      title: cat.title,
      label: cat.title,
      icon: <DatabaseOutlined />,
      onClick: () => {
        router.push(`/${cat.company}/category/${cat._id}`)
        setHideSidebar(true)
      },
    }))

  const parseCompaniesToMenuItem = (companies: CompanyEntity[]) =>
    companies.map((company) => ({
      key: company._id,
      title: company.name,
      label: company.name,
      icon: <BankOutlined />,
      onClick: () => {
        router.push(`/${company.companyId}`)
        setSelectedCompanies([company])
        setHideSidebar(true)
      },
    }))

  const authenticate = () => {
    router.push(makeContextualHref({ auth: true } as any), 'auth', {
      shallow: true,
    })
  }
  const handleReturnToHref = () => router.push(returnHref)

  const goToCompany = (comp: CompanyEntity) => (e: any) => {
    e.preventDefault()
    router.push(`/${comp.companyId}`)
    setSelectedCompanies([comp])
  }

  return (
    <>
      <Header className={styles.navbar}>
        <div
          className={`grid-container grid-column-full px-xx-l ${styles.navbarOptionsWrapper}`}
        >
          <div
            className={`${styles.navbarLogoContainer} flex-start-center gap-l`}
          >
            <Link href={`/`}>
              <HomeOutlined style={{ fontSize: '30px' }} />
            </Link>
            {selectedCompanies.map((company) => (
              <div
                onClick={goToCompany(company)}
                className="cursor-pointer"
                key={company._id}
              >
                <img className={styles.navbarLogo} src={company.logo} />
              </div>
            ))}
          </div>
          <div
            className={`${styles.navbarOptionsList} ${styles.navbarOptionsListCenter} flex-center-center`}
          >
            {navbarOptions
              .slice(0, navbarOptionsLimit)
              .map((navOption: MenuItemType, i) => (
                <div
                  key={`nav-option-${i}`}
                  className={`${styles.navbarOptionsListItem} ${
                    router.query.category === navOption.key
                      ? styles.navbarOptionsListItemActive
                      : ''
                  }`}
                  onClick={navOption.onClick as any}
                >
                  {navOption.title}
                </div>
              ))}
            {navbarOptions.length > navbarOptionsLimit && (
              <div className={styles.navbarOptionsListItem}>
                <Dropdown
                  menu={{
                    items: navbarOptions.slice(navbarOptionsLimit) as any,
                    selectable: true,
                    selectedKeys: [router.query.category as string],
                  }}
                  trigger={['click']}
                >
                  <Space>
                    Click me
                    <DownOutlined />
                  </Space>
                </Dropdown>
              </div>
            )}
          </div>

          <div className={`${styles.navbarOptionsList} flex-end-center`}>
            <HandleAuthVisibility visibleOn="no-auth">
              <div
                className={styles.navbarOptionsListItem}
                onClick={authenticate}
              >
                Iniciar Sesion
              </div>
            </HandleAuthVisibility>
            <HandleAuthVisibility visibleOn="auth">
              <div className={styles.navbarOptionsListItem}>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'profile',
                        onClick: () => router.push('/client/profile'),
                        label: 'Perfil',
                      },
                      {
                        key: 'my-orders',
                        onClick: () => router.push('/client/orders'),
                        label: 'Mis Ordenes',
                      },
                      {
                        key: 'sign-out',
                        onClick: () => appLogOut(),
                        label: 'Cerrar Sesión',
                      },
                    ] as any,
                    selectable: true,
                    selectedKeys: [router.query.category as string],
                  }}
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <Space>
                    <Avatar size={40}>
                      {client?.firstName?.substring(0, 1)?.toUpperCase()}
                      {client?.lastName?.substring(0, 1)?.toUpperCase()}
                    </Avatar>
                  </Space>
                </Dropdown>
              </div>
            </HandleAuthVisibility>
            <div className={styles.navbarOptionsListItem} onClick={toggleCart}>
              <Badge count={!cartIsOpen ? salesQuantity : 0}>
                {cartIsOpen ? (
                  <CloseOutlined style={{ fontSize: '24px' }} />
                ) : (
                  <ShoppingCartOutlined style={{ fontSize: '24px' }} />
                )}
              </Badge>
            </div>
          </div>
        </div>
      </Header>
      <Modal
        title=""
        open={!!authIsEnable}
        afterClose={handleReturnToHref}
        onCancel={handleReturnToHref}
        footer={[]}
      >
        <Auth isModal />
      </Modal>

      <ShoppingCartDrawer open={cartIsOpen} onClose={toggleCart} />
      <Sider
        className={styles.navbarSidebar}
        collapsible
        collapsedWidth={0}
        collapsed={showSidebar}
        onCollapse={(value) => setHideSidebar(value)}
        theme={'light'}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={navbarOptions}
        />
      </Sider>
    </>
  )
}
