import React from 'react'
import { Button, Form, Input } from 'antd'
import { useAppStore } from '@services/store'
import { useRouter } from 'next/router'
import { IAuthProps } from '@screens/Auth/Auth'
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum'
import { MaskedInput } from 'antd-mask-input'
import { UserOutlined } from '@ant-design/icons'

export const Login = ({ isModal }: IAuthProps) => {
  const router = useRouter()
  const clientEntity = useAppStore((state) => state.clients((statea) => statea))

  const submit = async (data: any) => {
    data.phone = Number(data.phone.toString().replace(/[- ()]/g, ''))

    if (
      await clientEntity.add(data, {
        endpoint: EndpointsAndEntityStateKeys.LOGIN,
      })
    ) {
      // TODO: success Login
      if (isModal) {
        router.back()
      } else {
        router.push('/')
      }
    }
  }

  return (
    <Form
      className="pt-s"
      name="basic"
      layout="vertical"
      onFinish={submit}
      autoComplete="off"
    >
      <Form.Item label="Whatsapp" name="phone" rules={[{ required: true }]}>
        <MaskedInput
          maskOptions={{
            lazy: true,
          }}
          mask={'+1 (000) 000-0000'}
          size="large"
        />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true }]}>
        <Input.Password size="large" />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          type="primary"
          shape="round"
          block
          size="large"
          icon={<UserOutlined />}
        >
          Iniciar Sesión
        </Button>
      </Form.Item>
    </Form>
  )
}
