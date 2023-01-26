import { Sidebar } from '@shared/layout/components/Sidebar/Sidebar'
import { DetailView } from '@screens/DetailView'
import { LayoutContent } from '@shared/layout/components/Content/LayoutContent'
import styles from './HandlePost.module.scss'
import { Button, Checkbox, Form, Input, Select, Switch, Upload } from 'antd'
import { PostEntity } from '@shared/entities/PostEntity'
import { InboxOutlined } from '@ant-design/icons'
import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import { useEffect, useState } from 'react'
import { IOption } from '@interfaces/common.intefacce'
import { parseToOptionList } from '../../utils/objects.utils'
import { CategoryEntity } from '@shared/entities/CategoryEntity'

// const categories = [
//   {
//     value: 'Carro/Camion',
//     label: 'Carro/Camion',
//   },
//   {
//     value: 'motor',
//     label: 'Motocicleta',
//   },
//   {
//     value: 'boat',
//     label: 'Bote',
//   },
//   {
//     value: 'Otro',
//     label: 'Otro',
//   },
// ]
const condition = [
  {
    value: 'new',
    label: 'Nuevo',
  },
  {
    value: 'used-like-new',
    label: 'Usado - Como Nuevo',
  },
  {
    value: 'used-good',
    label: 'Usado - Bien',
  },
  {
    value: 'used-bad',
    label: 'Usado - Mal',
  },
]

const meetTypes = [
  { label: 'En un lugar Publico', value: 'Apple' },
  { label: 'Door to Door', value: 'Pear' },
  { label: 'Dejar en la puerta', value: 'Orange' },
]
const productEntity = {} as any

const createProduct = () => {
  if (!true) {
    productEntity.add(
      {
        title: 'Example',
        description: 'Description',
        price: 100,
        categoryId: '62e6a79408f79af1b90884f9',
        subCategoryId: '62e6a79408f79af1b90884f9',
        statusId: 1,
        images: [
          'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?cs=srgb&dl=pexels-pixabay-45201.jpg&fm=jpg',
        ],
        typeCurrencyId: 1,
      },
      { path: 'create' }
    )
  } else {
    // productEntity.update(product.id, product)
  }
  // setProduct({} as PostEntity)
}

export const HandlePost = () => {
  const [postItem, setPostItem] = useState<PostEntity>({} as PostEntity)
  const [categoriesSelectList, setCategoriesSelectList] = useState<IOption[]>(
    []
  )

  const { add } = handleEntityHook<PostEntity>('posts')
  const { data: categories } = handleEntityHook<CategoryEntity>(
    'categories',
    true
  )

  useEffect(() => {
    setCategoriesSelectList(parseToOptionList(categories, '_id', 'name'))
  }, [])
  const onValuesChanges = (data: any) => console.log('value', data)

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  const submit = (values: any) => {
    console.log(values)
  }

  return (
    <LayoutContent className={styles.HandlePost}>
      <Sidebar>
        <Form
          className={styles.FormPost}
          name="createProduct"
          layout="vertical"
          onFinish={submit}
          // onFieldsChange={onFieldsChange}
          onValuesChange={onValuesChanges}
        >
          <Form.Item label="Image">
            <Form.Item
              name="images"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              <Upload.Dragger name="images" listType="picture">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>

          <Form.Item label="Titulo" name="title" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Precio"
            name="price"
            type="number"
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Categoria"
            name="categoryId"
            rules={[{ required: true }]}
          >
            <Select
              size="large"
              defaultValue="Select role"
              options={categoriesSelectList}
            />
          </Form.Item>
          <Form.Item
            label="Condicion"
            name="statusId"
            rules={[{ required: true }]}
          >
            <Select
              className="w-100"
              size="large"
              defaultValue="Select role"
              options={condition}
            />
          </Form.Item>
          <Form.Item label="Marca" name="brand" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Etiquetas" name="tags" rules={[{ required: true }]}>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Tags Mode"
            />
          </Form.Item>
          <Form.Item label="SKU" name="sku">
            <Input size="large" />
          </Form.Item>
          <Form.Item label="meetTypes" name="meet">
            <Checkbox.Group options={meetTypes} defaultValue={['Apple']} />
          </Form.Item>
          <Form.Item label="Ocultar de Revendedores" name="hide">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Sidebar>
      <div className={styles.handlePostPreview}>
        <DetailView isPreview />
      </div>
    </LayoutContent>
  )
}

// title: string = ''
// slug: string = ''
// description: string = ''
//
// price: number = ''
// images: string[] = ''
//
// categoryId: string = ''
// subCategoryId: string = ''
// typeCurrencyId: string = ''
// userId: string = ''
// storeId: string = ''
//
// // params: IParam[] = "";
// // commission: ICommission = "";
//
// createdAt: Date = ''
