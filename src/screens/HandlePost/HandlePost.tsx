import { Sidebar } from '@shared/layout/components/Sidebar/Sidebar'
import { DetailView } from '@screens/DetailView'
import { LayoutContent } from '@shared/layout/components/Content/LayoutContent'
import styles from './HandlePost.module.scss'
import { Button, Checkbox, Form, Input, Select, Switch } from 'antd'

const categories = [
  {
    value: 'Carro/Camion',
    label: 'Carro/Camion',
  },
  {
    value: 'motor',
    label: 'Motocicleta',
  },
  {
    value: 'boat',
    label: 'Bote',
  },
  {
    value: 'Otro',
    label: 'Otro',
  },
]
const condition = [
  {
    value: 'Carro/Camion',
    label: 'Nuevo',
  },
  {
    value: 'motor',
    label: 'Usado - Como Nuevo',
  },
  {
    value: 'boat',
    label: 'Usado - Bien',
  },
  {
    value: 'boat',
    label: 'Usado - Mal',
  },
]

const meetTypes = [
  { label: 'En un lugar Publico', value: 'Apple' },
  { label: 'Door to Door', value: 'Pear' },
  { label: 'Dejar en la puerta', value: 'Orange' },
]

export const HandlePost = () => {
  return (
    <LayoutContent className={styles.HandlePost}>
      <Sidebar>
        <Form
          className={styles.FormPost}
          name="createProduct"
          layout="vertical"
          // onFinish={createUser}
        >
          <Form.Item label="Titulo" name="title" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Precio"
            name="price"
            rules={[{ type: 'number', required: true }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Categoria"
            name="category"
            rules={[{ required: true }]}
          >
            <Select
              size="large"
              defaultValue="Select role"
              options={categories}
            />
          </Form.Item>
          <Form.Item
            label="Condicion"
            name="condition"
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
              // onChange={handleChange}
              // options={options}
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
