import { Button, Form, Input, Select } from 'antd'
import { useAppStore } from '@services/store'
import { UserEntity } from '@shared/entities/UserEntity'
import { MaskedInput } from 'antd-mask-input'
import { useRouter } from 'next/router'
import { IAuthProps } from '@screens/Auth/Auth'
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum'

export const Register = ({ isModal }: IAuthProps) => {
  const userEntity = useAppStore((state) => state.users((stateu) => stateu))
  const authEntity = useAppStore((state) =>
    state['auth/login']((stateu) => stateu)
  )
  const router = useRouter()

  const createUser = async (data: UserEntity) => {
    data.storeMetadata = {
      website: 'https://www.google.com',
      info: 'info',
      benefits: [''],
    }
    data.phone = Number(data.phone.toString().replace(/[- ()]/g, ''))

    if (
      await userEntity.add(data, {
        endpoint: EndpointsAndEntityStateKeys.CREATE,
      })
    ) {
      if (
        await authEntity.add({
          email: data.email,
          password: data.password,
        })
      ) {
        if (isModal) {
          router.back()
        } else {
          router.push('/')
        }
      }
    } else {
      router.push('/auth')
    }
  }

  return (
    <Form
      name="registerUser"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={createUser}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item label="Apellido" name="lastName" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: 'email' }]}
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item label="Username" name="userName" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item label="Telefono" name="phone" rules={[{ required: true }]}>
        <MaskedInput mask={'+1 (000) 000-0000'} size="large" />
      </Form.Item>
      <Form.Item label="Role" name="role" rules={[{ required: true }]}>
        <Select
          size="large"
          defaultValue="Select role"
          style={{ width: 120 }}
          options={[
            {
              value: 'user',
              label: 'User',
            },
            {
              value: 'reseller',
              label: 'Revendedor',
            },
            {
              value: 'store',
              label: 'Tienda',
            },
          ]}
        />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true }]}>
        <Input.Password size="large" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
