import styles from './FiltersSidebar.module.scss'
import { AutoComplete, Checkbox, Input, Select, Slider, Switch } from 'antd'
import { useState } from 'react'
import { cleanText } from '../../../utils/text.utils'
import { IOption } from '@interfaces/common.intefacce'
import { DynamicParams } from '@components/DynamicParams/DynamicParams'

export const FiltersSidebar = () => {
  const [priceRange, setPriceRange] = useState<number[]>([])

  const onChangePrice = (data: any) => setPriceRange(data)
  const catAndSubCatOptions = Array.from(new Array(10)).map((item, i) => ({
    label: 'Cat ' + (i + 1),
    options: [
      {
        value: Math.random(),
        label: 'Celulares ' + (i + 1),
      },
      {
        value: Math.random() + 1,
        label: 'Celulares ' + (i + 2),
      },
    ],
  }))

  const filterCategoriesOptions = (input: string, option?: IOption) => {
    return cleanText(option?.label ?? '').includes(cleanText(input))
  }
  const roles = ['Todos', 'Revendedores', 'Tiendas', 'Vendedores']
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
        />
      </div>

      <div className={`${styles.FilterWrapper} ${styles.Column}`}>
        <label>Solo productos de</label>
        <Checkbox.Group
          className="grid-column-fit-1 mt-s"
          options={roles}
          defaultValue={['Apple']}
          // onChange={onChange}
        />
      </div>
      <div className={styles.FilterList}>
        {Array.from(new Array(5)).map((item, i) => (
          <div className={styles.FilterListItem}>Category {i + 1}</div>
        ))}
      </div>
      <div className={`${styles.FilterWrapper} ${styles.Column}`}>
        <label>Ordenar por</label>
        <Select
          className="w-100 mt-s"
          // defaultValue="lucy"
          // style={{ width: 200 }}
          // onChange={handleChange}
          options={sortBy}
        />
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
        <DynamicParams />
      </div>
    </div>
  )
}
