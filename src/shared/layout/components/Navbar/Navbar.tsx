import { Header } from 'antd/lib/layout/layout'
import logo from '@assets/images/logo.png'
import person from '@assets/images/person.png'
import Image from 'next/image'
import styles from './Navbar.module.scss'
import { Button, Dropdown, Input, MenuProps, Modal, Select } from 'antd'
const { Option } = Select
import { ChangeEvent, useState } from 'react'
import { CategoriesDrawer } from '@shared/layout/components/CategoriesDrawer/CategoriesDrawer'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContextualRouting } from 'next-use-contextual-routing'
import { Auth } from '@screens/Auth/Auth'
import { CategoryEntity } from '@models/CategoryEntity'
import { getEntityDataHook } from '@shared/hooks/getEntityDataHook'
import { getAuthData, appLogOut } from '../../../../utils/auth.utils'
import { UserEntity } from '@models/UserEntity'
import { MainContentModal } from '@components/MainContentModal/MainContentModal'
import { Search } from '@screens/Search'

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
      <Option value={item.slug} key={item._id}>
        {item.name}
      </Option>
    ))}
  </Select>
)

export const Navbar = () => {
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>()
  const [showContextSearchModal, setShowContextSearchModal] =
    useState<boolean>(false)
  const [categorySlug, setCategorySlug] = useState<string>()
  const router = useRouter()
  const authIsEnable = router.query.auth
  const { makeContextualHref, returnHref } = useContextualRouting()
  const handleCloseAuthModal = () => router.push(returnHref)
  const authUser = getAuthData('user') as UserEntity
  const { data: categories } = getEntityDataHook<CategoryEntity>(
    'categories',
    true
  )
  const enableContextSearch = !returnHref.includes('search')
  console.log('cate', categories)

  const authenticate = () => {
    router.push(makeContextualHref({ auth: true }), 'auth', { shallow: true })
  }

  const userDropdownItems: MenuProps['items'] = [
    {
      key: 'account',
      label: 'Mi cuenta',
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

  const onSearch =
    (contextSearch: boolean = false) =>
    (data: ChangeEvent<HTMLInputElement> | string) => {
      let path = 'autocomplete-by-title'
      if (categorySlug) path = ''
      const value: string = (data as ChangeEvent<HTMLInputElement>).target
        ? (data as ChangeEvent<HTMLInputElement>).target.value
        : (data as string)

      setSearchValue(value)

      if (contextSearch) {
        const queryParams: any = {
          value,
          categorySlug,
          extraPath: ['autocomplete-by-title'].join('/'),
        }
        setShowContextSearchModal(!!value)
        const queryString = new URLSearchParams(queryParams).toString()
        console.log(queryString)
        router.push(
          makeContextualHref(queryParams),
          `/search/${path}/?${queryString}`
        )
      } else {
        router.push({
          pathname: `/search/${path}/`,
          query: { value, categorySlug },
        })
        setShowContextSearchModal(false)
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
      <Header className={`${styles.navbar}`}>
        <div className="grid-container grid-column-full px-xx-l">
          <div className={`${styles.navbarLogoContainer} flex-start-center`}>
            <div onClick={goToHome} className="cursor-pointer">
              <Image src={logo} alt="Store Logo" />
            </div>
          </div>
          <div className={`${styles.navbarBrowserWrapper} flex-center-center`}>
            <Input.Search
              value={searchValue}
              size="large"
              allowClear
              addonBefore={
                <SelectBefore
                  categories={categories}
                  onSelect={onSelectCategory}
                />
              }
              placeholder="DetailView"
              onChange={onSearch(true)}
              onSearch={onSearch(false)}
            />
          </div>
          <ul className={`${styles.navbarOptionsList} flex-end-center`}>
            {!authUser && <li onClick={authenticate}>Iniciar Session</li>}
            <li>
              <Link href="/post">
                <Button type="default">Publicar</Button>
              </Link>
            </li>
            {authUser && (
              <li className={styles.userDropdown}>
                <Dropdown
                  menu={{ items: userDropdownItems }}
                  trigger={['click']}
                  placement="bottom"
                >
                  <Image src={person} alt="user icon" />
                </Dropdown>
              </li>
            )}
          </ul>
        </div>
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
              <li key={item._id}>{item.name}</li>
            ))}
          </ul>
        </div>
      </Header>

      <CategoriesDrawer
        visible={showAllCategories}
        onClose={toggleAllCategoriesDrawer}
        authenticate={authenticate}
      />
      <Modal
        title="Basic Modal"
        open={!!authIsEnable}
        onOk={handleCloseAuthModal}
        onCancel={handleCloseAuthModal}
      >
        <Auth isModal />
      </Modal>
      <MainContentModal show={showContextSearchModal && enableContextSearch}>
        <Search hideSidebar={true} />
      </MainContentModal>
    </>
  )
}
