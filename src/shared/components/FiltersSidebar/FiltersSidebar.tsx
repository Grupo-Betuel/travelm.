import styles from './FiltersSidebar.module.scss'
import { Checkbox, Input, Select, Slider } from 'antd'
import { useEffect, useState } from 'react'
import { cleanText } from '../../../utils/text.utils'
import { DynamicParams } from '@shared/components'
import { IPostFilters } from '@interfaces/posts.interface'
import { CategoryEntity } from '@shared/entities/CategoryEntity'
import { IOption } from '@interfaces/common.intefacce'
import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import { ParamEntity } from '@shared/entities/ParamEntity'
import { SubCategoryEntity } from '@shared/entities/SubCategoryEntity'
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum'
import { CheckboxValueType } from 'antd/es/checkbox/Group'
import { UserRoles } from '@interfaces/users.interface'
import { valid } from 'semver'

export interface IFilterSidebarProps {
  applyFilters: (filters: Partial<IPostFilters>) => void
  categories: CategoryEntity[]
}

export const FiltersSidebar = ({
  applyFilters,
  categories,
}: IFilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState<number[]>([])
  const [filters, setFilters] = useState<Partial<IPostFilters>>()
  const { 'by-ids': filterParams, get: getParams } =
    handleEntityHook<ParamEntity>('filter-params')

  useEffect(() => {
    if (filters) {
      applyFilters(filters)
    }
  }, [filters])

  const onChangePrice = (data: any) => setPriceRange(data)

  const catAndSubCatOptions: IOption[] = categories.map((item, i) => ({
    label: item.name,
    options: item.subCategories.map((item) => ({
      value: item._id,
      label: item.name,
      data: item.params,
    })),
  }))

  const filterCategoriesOptions = (input: string, option?: IOption) => {
    return cleanText(option?.label ?? '').includes(cleanText(input))
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

  const changeCategory = (
    optionsValue: string[],
    options: IOption | IOption[]
  ) => {
    const params: string[] = [] as any
    ;(options as IOption[]).forEach((opt: IOption) => {
      opt.data.forEach((p: string) => params.push(p))
    })

    const paramsIds = params.join('&ids=')
    console.log('paramsIds => ', paramsIds)
    getParams({
      endpoint: EndpointsAndEntityStateKeys.PARAMS_BY_IDS,
      queryString: `ids=${paramsIds}`,
    })
  }

  const onChangeRole = (checkedValue: Array<CheckboxValueType>) => {
    console.log('checked', checkedValue)

    setFilters({
      ...filters,
      role: checkedValue as UserRoles[],
    })
  }

  return (
    <div className={styles.SearchWrapper}>
      <h3 className={styles.FilterTitle}>Filtros</h3>
      <div className={`${styles.FilterWrapper} ${styles.Column}`}>
        <label>Selecciona Categoria</label>
        <Select
          showSearch
          mode="multiple"
          className="w-100 mt-s"
          filterOption={filterCategoriesOptions}
          // defaultValue="lucy"
          // style={{ width: 200 }}
          // onChange={handleChange}
          options={catAndSubCatOptions}
          onChange={changeCategory}
        />
      </div>

      <div className={`${styles.FilterWrapper} ${styles.Column}`}>
        <label>Solo productos de</label>
        <Checkbox.Group
          className="grid-column-fit-1 mt-s"
          options={roles}
          onChange={onChangeRole}
        />
      </div>
      <div className={styles.FilterList}>
        {Array.from(new Array(5)).map((item, i) => (
          <div className={styles.FilterListItem} key={i}>
            Category {i + 1}
          </div>
        ))}
      </div>
      <div className={`${styles.FilterWrapper} ${styles.Column}`}>
        <span className={styles.FilterLabel}>Precio</span>
        <Input.Group compact>
          <Input
            defaultValue=""
            style={{ width: '50%' }}
            value={priceRange[0]}
            // name="0"
            // onChange={changePrice}
          />
          <Input
            defaultValue=""
            style={{ width: '50%' }}
            value={priceRange[1]}
          />
        </Input.Group>
        <Slider range defaultValue={[20, 50]} onChange={onChangePrice} />
      </div>
      <div className={styles.FilterWrapper}>
        <DynamicParams
          params={filterParams?.data || []}
          renderType="responseParameterType"
        />
      </div>
    </div>
  )
}
