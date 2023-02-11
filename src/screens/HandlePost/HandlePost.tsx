import { Sidebar } from '@shared/layout/components/Sidebar/Sidebar'
import { DetailView } from '@screens/DetailView'
import { LayoutContent } from '@shared/layout/components/Content/LayoutContent'
import styles from './HandlePost.module.scss'
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  Slider,
  Switch,
  Upload,
} from 'antd'
import { PostEntity } from '@shared/entities/PostEntity'
import { InboxOutlined } from '@ant-design/icons'
import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import { useEffect, useRef, useState } from 'react'
import { IOption } from '@interfaces/common.intefacce'
import { parseToOptionList } from '../../utils/objects.utils'
import { CategoryEntity } from '@shared/entities/CategoryEntity'
import { getBase64FromFile } from '../../utils/blob.utils'
import { RcFile, UploadChangeParam } from 'antd/es/upload'
import { UploadFile } from 'antd/es/upload/interface'
import { debounce } from 'lodash'
import { StickyFooter } from '@shared/layout/components/StickyFooter/StickyFooter'
import { Endpoints } from '@shared/enums/endpoints.enum'

const defaultPercentValue = 10
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

export const HandlePost = () => {
  const [postForm] = Form.useForm()
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
  }, [categories])

  const onSelectImage = useRef(
    debounce((data: UploadChangeParam<UploadFile>) => {
      Promise.all(
        data.fileList.map((file: UploadFile) =>
          getBase64FromFile(file.originFileObj as RcFile)
        )
      ).then((images: string[]) => {
        setPostItem({ ...postItem, images })
      })
    }, 300)
  ).current

  const onValuesChanges = (
    value: { [N in keyof PostEntity]: any },
    data: PostEntity
  ) => {
    const realDAta = {
      ...data,
      images: postItem.images,
    }
    setPostItem(realDAta)
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  const submit = (values: any) => {
    console.log('form value', values)
    console.log(
      'added',
      add(
        {
          ...values,
          subCategoryId: 'id',
          typeCurrencyId: 1,
          images: postItem.images,
        },
        { endpoint: Endpoints.CREATE }
      )
    )
  }

  const changeCommission =
    (type: 'price' | 'percent' | 'quantity') => (value: number | any) => {
      const price =
        postForm.getFieldValue(type === 'price' ? 'commission' : 'price') ||
        defaultPercentValue
      const percentValue =
        type === 'price' || type === 'percent'
          ? (price * value) / 100
          : (value / price) * 100
      console.log(value, price, 'result', percentValue)
      if (type === 'price' || type === 'percent') {
        postForm.setFieldValue('commissionQuantity', percentValue)
      } else {
        postForm.setFieldValue('commission', percentValue)
      }
    }

  const commissionPercentTooltipFormatter = (value: number) => `${value}%`

  const disableCommission = !postForm.getFieldValue('price')

  return (
    <LayoutContent className={styles.HandlePost}>
      <Sidebar>
        <Form
          form={postForm}
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
              <Upload.Dragger
                beforeUpload={() => false}
                name="images"
                accept="image/*"
                listType="picture-card"
                onChange={onSelectImage}
                multiple
              >
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
            rules={[{ type: 'number', required: true }]}
          >
            <InputNumber
              size="large"
              className="w-100"
              onChange={changeCommission('price')}
            />
          </Form.Item>
          <Form.Item
            label="Categoria"
            name="categoryId"
            rules={[{ required: true }]}
          >
            <Select
              size="large"
              placeholder="Select role"
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
              placeholder="Select role"
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
            <Checkbox.Group options={meetTypes} />
          </Form.Item>
          <Form.Item label="Ocultar de Revendedores" name="hide">
            <Switch checked={false} />
          </Form.Item>
          <Form.Item
            label="Comision"
            name="commissionQuantity"
            rules={[
              {
                required: true,
                type: 'number',
                max: postForm.getFieldValue('price'),
              },
            ]}
          >
            <InputNumber
              className="w-100"
              addonBefore="RD$"
              size="large"
              disabled={disableCommission}
              onChange={changeCommission('quantity')}
            />
          </Form.Item>
          <Form.Item name="commission">
            <Slider
              tooltip={{ formatter: commissionPercentTooltipFormatter }}
              onChange={changeCommission('percent')}
              disabled={disableCommission}
            />
          </Form.Item>
        </Form>
        <StickyFooter>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </StickyFooter>
      </Sidebar>
      <div className={styles.handlePostPreview}>
        <DetailView previewItem={postItem} />
      </div>
    </LayoutContent>
  )
}
