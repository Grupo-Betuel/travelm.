import { Header } from 'antd/lib/layout/layout'
import logo from '@assets/images/logo.png'
import Image from 'next/image'
import styles from './Navbar.module.scss'
import { Button, Drawer, Dropdown, Input, MenuProps, Modal, Select } from 'antd'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { CategoriesDrawer } from '@shared/layout/components/CategoriesDrawer/CategoriesDrawer'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContextualRouting } from 'next-use-contextual-routing'
import { Auth } from '@screens/Auth/Auth'
import { CategoryEntity } from '@shared/entities/CategoryEntity'
import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import { appLogOut, getAuthData } from '../../../../utils/auth.utils'
import { UserEntity } from '@shared/entities/UserEntity'
import { MainContentModal } from '@shared/components'
import { Search } from '@screens/Search'
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum'
import {
  BellOutlined,
  UserOutlined,
  MessageOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import { NotificationDrawer } from '@shared/layout/components/NotificationDrawer'
import { HandleAuthVisibility } from '@shared/components'
import { DatesDrawer } from '@shared/layout/components/DatesDrawer'
import { Messaging } from '@screens/Messaging'
import { handleSearchPostHook } from '@shared/hooks/handleSearchPostHook'

const { Option } = Select

export interface ICategorySelect {
  categories: CategoryEntity[]
  onSelect: (slug: string) => void
}

const SelectBefore = (props: ICategorySelect) => (
  <Select
    defaultValue="Todas"
    className="select-before"
    onChange={props.onSelect}
  >
    {props.categories.map((item, i) => (
      <Option value={item.slug} key={item.slug}>
        {item.name}
      </Option>
    ))}
  </Select>
)

export const Navbar = () => {
  const router = useRouter()
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false)
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [showMessaging, setShowMessaging] = useState<boolean>(false)
  const [showDates, setShowDates] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>()
  const [showContextSearchModal, setShowContextSearchModal] =
    useState<boolean>(false)
  const [categorySlug, setCategorySlug] = useState<string>()
  const authIsEnable = router.query.auth
  const { makeContextualHref, returnHref } = useContextualRouting()
  const handleReturnToHref = () => router.push(returnHref)
  const authUser = getAuthData('access_token') as UserEntity
  const {
    data: categories,
    get: getCategories,
    ['trending-categories']: trendingCategories,
  } = handleEntityHook<CategoryEntity>('categories', true)
  const enableContextSearch = !returnHref.includes('search')
  const { applyFilters } = handleSearchPostHook()

  const authenticate = () => {
    router.push(makeContextualHref({ auth: true }), 'auth', { shallow: true })
  }

  useEffect(() => {
    setTimeout(() => {
      const { title } = router.query
      // setSearchValue(title as string)
    })
  }, [])

  const getTrendingCats = () =>
    getCategories({ endpoint: EndpointsAndEntityStateKeys.TRENDING_CATEGORIES })

  const userDropdownItems: MenuProps['items'] = [
    {
      key: 'account',
      label: <Link href="/profile">Mi Pagina</Link>,
    },
    {
      key: 'posts',
      label: 'Publicaciones',
    },
    {
      key: 'log-out',
      label: <span onClick={appLogOut}>Cerrar Sesion</span>,
    },
  ]

  const toggleAllCategoriesDrawer = () => {
    setShowAllCategories(!showAllCategories)
  }

  const toggleNotificationDrawer = () => {
    setShowNotification(!showNotification)
  }

  const toggleMessagingDrawer = () => {
    setShowMessaging(!showMessaging)
  }

  const toggleDatesDrawer = () => {
    setShowDates(!showDates)
  }

  const onSearch =
    (contextSearch: boolean = false) =>
    (data: ChangeEvent<HTMLInputElement> | string) => {
      const title: string = (data as ChangeEvent<HTMLInputElement>).target
        ? (data as ChangeEvent<HTMLInputElement>).target.value
        : (data as string)
      setSearchValue(title)
      emptySearch(!!title)

      // if (!title) return
      if (contextSearch) {
        applyFilters({ title: title || '' })
      } else {
        router.push({
          pathname: '/search/',
          query: { title, categorySlug },
        })
        setShowContextSearchModal(false)
      }
    }

  const emptySearch = (isShown: boolean = false) => {
    if (enableContextSearch) {
      !isShown && handleReturnToHref()
      setShowContextSearchModal(isShown)
    }
  }

  const onSelectCategory = (slug: string) => setCategorySlug(slug)

  const goToHome = () => {
    router.push('/')
    setSearchValue('')
    setShowContextSearchModal(false)
  }

  return (
    <>
      <Header className={styles.navbar}>
        <div
          className={`grid-container grid-column-full px-xx-l ${styles.navbarOptionsWrapper}`}
        >
          <div className={`${styles.navbarLogoContainer} flex-start-center`}>
            <div onClick={goToHome} className="cursor-pointer">
              <Image priority src={logo} alt="Store Logo" />
            </div>
          </div>
          <div className={`${styles.navbarBrowserWrapper} flex-center-center`}>
            <Input.Search
              value={
                searchValue === undefined ? router.query.title : searchValue
              }
              size="large"
              allowClear
              addonBefore={
                <SelectBefore
                  categories={categories}
                  onSelect={onSelectCategory}
                />
              }
              placeholder="Messaging"
              onChange={onSearch(true)}
              onSearch={onSearch(false)}
            />
          </div>
          <div className={`${styles.navbarOptionsList} flex-end-center`}>
            <HandleAuthVisibility
              visibleOn="no-auth"
              className={styles.navbarOptionsListItem}
            >
              <div onClick={authenticate}>Iniciar Session</div>
            </HandleAuthVisibility>
            <div className={styles.navbarOptionsListItem}>
              <Link href="/post">
                <Button type="default">Publicar</Button>
              </Link>
            </div>
            <HandleAuthVisibility
              visibleOn="auth"
              className={styles.navbarOptionsListItem}
            >
              <div className={styles.userDropdown}>
                <Dropdown
                  menu={{ items: userDropdownItems }}
                  trigger={['click']}
                  placement="bottom"
                >
                  <UserOutlined className={styles.navbarIconOption} />
                </Dropdown>
              </div>
            </HandleAuthVisibility>
            <HandleAuthVisibility
              visibleOn="auth"
              className={styles.navbarOptionsListItem}
            >
              <BellOutlined
                className={styles.navbarIconOption}
                onClick={toggleNotificationDrawer}
              />
            </HandleAuthVisibility>
            <HandleAuthVisibility
              visibleOn="auth"
              className={styles.navbarOptionsListItem}
            >
              <MessageOutlined
                className={styles.navbarIconOption}
                onClick={toggleMessagingDrawer}
              />
            </HandleAuthVisibility>
            <HandleAuthVisibility
              visibleOn="auth"
              className={styles.navbarOptionsListItem}
            >
              <CalendarOutlined
                className={styles.navbarIconOption}
                onClick={toggleDatesDrawer}
              />
            </HandleAuthVisibility>
          </div>
        </div>
      </Header>
      <div className={`${styles.navbarFavoritesWrapper} px-xx-l`}>
        <ul className="flex-between-center w-100">
          <li>
            <div
              className="flex-start-center cursor-pointer"
              onClick={toggleAllCategoriesDrawer}
            >
              <i className="bi bi-list font-size-9" />
              <span>Ver Todo</span>
            </div>
          </li>
          {categories.slice(0, 4).map((item) => (
            <li key={item.slug}>{item.name}</li>
          ))}
        </ul>
      </div>
      <CategoriesDrawer
        open={showAllCategories}
        onClose={toggleAllCategoriesDrawer}
        authenticate={authenticate}
      />
      {authUser && (
        <NotificationDrawer
          open={showNotification}
          onClose={toggleNotificationDrawer}
        />
      )}
      {authUser && (
        <Drawer open={showMessaging} onClose={toggleMessagingDrawer}>
          <Messaging sidebarMode />
        </Drawer>
      )}
      {authUser && (
        <DatesDrawer
          size="large"
          open={showDates}
          onClose={toggleDatesDrawer}
        />
      )}
      <Modal
        title="Basic Modal"
        open={!!authIsEnable}
        onOk={handleReturnToHref}
        onCancel={handleReturnToHref}
      >
        <Auth isModal />
      </Modal>
      <MainContentModal show={showContextSearchModal}>
        <Search hideSidebar={true} />
      </MainContentModal>
    </>
  )
}
