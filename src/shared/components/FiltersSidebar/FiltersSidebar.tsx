import styles from './FiltersSidebar.module.scss'
import { Button, Checkbox, Form, Input, Slider, Tag, TreeSelect } from 'antd'
import { ChangeEvent, useEffect, useState } from 'react'
import { cleanText } from '../../../utils/text.utils'
import { DynamicParams } from '@shared/components'
import {
  IPostFilters,
  PostFiltersTagNamesTypes,
} from '@interfaces/posts.interface'
import { CategoryEntity } from '@shared/entities/CategoryEntity'
import { IOption } from '@interfaces/common.intefacce'
import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import { ParamEntity } from '@shared/entities/ParamEntity'
import { SubCategoryEntity } from '@shared/entities/SubCategoryEntity'
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum'
import { CheckboxValueType } from 'antd/es/checkbox/Group'
import { UserRoles } from '@interfaces/users.interface'
import { Sidebar } from '@shared/layout/components/Sidebar/Sidebar'
import { StickyFooter } from '@shared/layout/components/StickyFooter/StickyFooter'
import { IFilterParam } from '@interfaces/params.interface'
import { useRouter } from 'next/router'
import { parseQueryToObject } from '../../../utils/objects.utils'
import { PostFiltersTagNames } from '../../../utils/constants/post.contstants'

export interface IFilterSidebarProps {
  applyFilters: (filters: IPostFilters) => void
  categories: CategoryEntity[]
}

export const FiltersSidebar = ({
  applyFilters,
  categories,
}: IFilterSidebarProps) => {
  const [filters, setFilters] = useState<IPostFilters>({})
  const { 'by-ids': filterParams, get: getParams } =
    handleEntityHook<ParamEntity>('filter-params')
  const router = useRouter()

  const handleFilters = (newFilters: IPostFilters = {}) => {
    console.log('klk??', { ...filters, ...newFilters })
    applyFilters({ ...filters, ...newFilters })
    loadPostFiltersTags()
  }

  const [postsFiltersForm] = Form.useForm<IPostFilters>()

  useEffect(() => {
    loadFiltersFromQuery()
  }, [])

  const loadFiltersFromQuery = () => {
    const queryFilters = parseQueryToObject<IPostFilters>(router.asPath)

    postsFiltersForm.setFieldsValue({
      ...queryFilters,
      categoryId: queryFilters.categoryId || queryFilters.subCategoryId,
    })

    loadDynamicParamsFromSelectedCategory(queryFilters)

    setFilters({
      ...filters,
      priceRange: queryFilters.priceRange,
      categoryId: queryFilters.categoryId,
      subCategoryId: queryFilters.subCategoryId,
      role: queryFilters.role,
    })
  }

  const loadDynamicParamsFromSelectedCategory = (
    queryFilters: IPostFilters
  ) => {
    if (queryFilters.categoryId) {
      const selectedCat = getCategoryById(queryFilters.categoryId)
      if (selectedCat) {
        onSelectCategory(queryFilters.categoryId, { data: selectedCat })
      }
    }
  }

  const getCategoryById = (
    id: string
  ): CategoryEntity | SubCategoryEntity | undefined => {
    let selectedCat: CategoryEntity | SubCategoryEntity | undefined

    categories.forEach((cat) => {
      if (selectedCat) return
      if (cat._id == id) {
        selectedCat = cat
      } else {
        selectedCat = (cat as CategoryEntity).subCategories.find(
          (subCat) => subCat._id === id
        )
      }
    })

    return selectedCat
  }

  const onChangeRole = (checkedValue: Array<CheckboxValueType>) => {
    setFilters({
      ...filters,
      role: checkedValue as UserRoles[],
    })
  }

  const onChangeInputPrice = ({
    target: { value, name },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!value) return
    const val1 = filters.priceRange ? Number(filters.priceRange[0]) : 0
    const val2 = filters.priceRange ? Number(filters.priceRange[1]) : 0
    const priceRange: [number, number] =
      name === 'first' ? [Number(value), val2] : [val1, Number(value)]

    setFilters({
      ...filters,
      priceRange,
    })
  }

  const onChangeRangePrice = (data: [number, number]) => {
    setFilters({
      ...filters,
      priceRange: data,
    })
  }

  const onChangeCategory = (value?: string) => {
    if (!value) {
      setFilters({
        ...filters,
        subCategoryId: '',
        categoryId: '',
      })
    }
  }

  const onSelectCategory = (
    id: string | undefined,
    { data: cat }: { data: CategoryEntity | SubCategoryEntity }
  ) => {
    const isCategory = !!categories.find((cat) => cat._id === id)

    const { params } = cat

    const paramsIds = params.join('&ids=')
    getParams({
      endpoint: EndpointsAndEntityStateKeys.PARAMS_BY_IDS,
      // TODO: use this method in the future
      // queryParams: {
      //   ids: params,
      // },
      queryString: `ids=${paramsIds}`,
    })

    const categoryFilter: IPostFilters = isCategory
      ? { categoryId: id, subCategoryId: '' }
      : { subCategoryId: id, categoryId: '' }

    setFilters({
      ...filters,
      ...categoryFilter,
    })
  }

  const onChangeFilterParams = (filterParams: IFilterParam[]) => {
    setFilters({
      ...filters,
      filterParams,
    })
  }

  const catAndSubCatOptions: IOption[] = categories.map((item, i) => ({
    title: item.name,
    value: item._id,
    data: item,
    children: item.subCategories.map((item) => ({
      value: item._id,
      title: item.name,
      data: item,
    })),
  }))

  const filterCategoriesOptions = (input: string, option?: IOption) => {
    const inputCleaned = cleanText(input);
    const optionLabelCleaned = cleanText(option?.label ?? '');
    return optionLabelCleaned.includes(inputCleaned);
  }

  const roles = [
    { value: '', label: 'Todos' },
    { value: UserRoles.RESELLER, label: 'Revendedores' },
    { value: UserRoles.SELLER, label: 'Vendedores' },
    { value: UserRoles.STORE, label: 'Tiendas' },
  ]

  const sortBy = [
    {
      value: 'mostRecent',
      label: 'Mas Recientes',
    },
    {
      value: 'mostRecent2',
      label: 'Mas Baratos',
    },
    {
      value: 'mostRecent3',
      label: 'Mas Caros',
    },
    {
      value: 'mostRecent4',
      label: 'Precios intermedios',
    },
    {
      value: 'mostRecent56',
      label: 'Mayor Comision',
    },
    {
      value: 'mostRecent563',
      label: 'Menor Comision',
    },
  ]

  const [postFiltersTags, setPostFiltersTags] =
    useState<PostFiltersTagNamesTypes>({})

  const loadPostFiltersTags = () => {
    const tags: PostFiltersTagNamesTypes = {}
    ;(Object.keys(filters) as any).forEach((K: keyof IPostFilters) => {
      if (!filters[K]) return
      const label = PostFiltersTagNames[K]
      let value = filters[K]

      if ((K === 'categoryId' || K === 'subCategoryId') && filters[K]) {
        const cat = getCategoryById(filters[K] as string)
        if (cat) {
          value = cat.name
        }
      }

      tags[K] = `${label}: ${value}`
      console.log('tags[K] =>', tags[K])
    })

    console.log('filters ->', filters, tags)

    setPostFiltersTags(tags)
  }

  const removeFilterPerKey = (key: keyof IPostFilters) => () => {
    console.log('removeFilterPerKey() called, key: ', key)
    const newFilters = {
      ...filters,
      [key]: '',
    }
    console.log('newFilters: ', newFilters)
    setFilters(newFilters)

    let formKey = key === 'subCategoryId' ? 'categoryId' : key
    postsFiltersForm.setFieldValue(formKey, '')
    handleFilters(newFilters)
  }

  return (
    <Sidebar>
      <div className={styles.SearchWrapper}>
        <Form<IPostFilters> form={postsFiltersForm} layout="vertical">
          <h3 className={styles.FilterTitle}>Filtros</h3>
          {/*// TODO: tag filters*/}
          <div className={`${styles.FilterTagsWrapper}`}>
            {(Object.keys(postFiltersTags) as any).map(
              (f: keyof IPostFilters) => {
                return (
                  postFiltersTags[f] && (
                    <Tag color="green" closable onClose={removeFilterPerKey(f)}>
                      <span>{postFiltersTags[f]}</span>
                    </Tag>
                  )
                )
              }
            )}
          </div>
          <Form.Item
            name="categoryId"
            label="Selecciona Categoria"
            className={`${styles.FilterWrapper} ${styles.Column}`}
          >
            <TreeSelect
              showSearch
              className="w-100"
              placeholder="Please select"
              allowClear
              treeDefaultExpandAll
              onSelect={onSelectCategory}
              treeData={catAndSubCatOptions as any}
              onChange={onChangeCategory}
            />
          </Form.Item>
          <Form.Item
            name="role"
            label="Solo productos de"
            className={`${styles.FilterWrapper} ${styles.Column}`}
          >
            <Checkbox.Group
              className="grid-column-fit-1 mt-s"
              options={roles}
              onChange={onChangeRole}
            />
          </Form.Item>
          {/* TODO: Check what should be a good filters type for those styled list*/}
          {/*<div className={styles.FilterList}>*/}
          {/*  {Array.from(new Array(5)).map((item, i) => (*/}
          {/*    <div className={styles.FilterListItem} key={i}>*/}
          {/*      Category {i + 1}*/}
          {/*    </div>*/}
          {/*  ))}*/}
          {/*</div>*/}
          <Form.Item
            name="priceRange"
            label="Precio"
            className={`${styles.FilterWrapper} ${styles.Column}`}
          >
            <Input.Group compact>
              <Input
                defaultValue=""
                type="number"
                name="first"
                style={{ width: '50%' }}
                value={filters.priceRange ? filters.priceRange[0] : undefined}
                onChange={onChangeInputPrice}
              />
              <Input
                defaultValue=""
                type="number"
                name="second"
                style={{ width: '50%' }}
                onChange={onChangeInputPrice}
                value={filters.priceRange ? filters.priceRange[1] : undefined}
              />
            </Input.Group>
          </Form.Item>
          <div className={`${styles.FilterWrapper} ${styles.Column}`}>
            <Slider
              range
              max={10000}
              value={filters.priceRange}
              defaultValue={[20, 50]}
              onChange={onChangeRangePrice}
            />
          </div>
        </Form>
        <div className={styles.FilterWrapper}>
          <DynamicParams
            params={filterParams?.data || []}
            renderType="responseParameterType"
            onChanges={onChangeFilterParams}
          />
        </div>
      </div>
      <StickyFooter>
        <Button onClick={() => handleFilters()}>Aplicar Filtros</Button>
      </StickyFooter>
    </Sidebar>
  )
}
