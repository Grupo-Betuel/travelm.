import React from 'react'
import { Button, Checkbox, ConfigProvider, Form, Input } from 'antd'
import { useAppStore } from '@services/store'
import auth from '../../../pages/auth'

const validateMessages = {
  required: "'${name}' is required bro!",
  // ...
}

export const Login = () => {
  const authEntity = useAppStore((state) =>
    state['auth/login']((statea) => statea)
  )

  const submit = (data: any) => {
    console.log('data =>', data)
    authEntity.add(data)
  }

  return (
    <div>
      {authEntity.loading && <div>Loading...</div>}

      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={submit}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: 'email', pattern: /[A-z]/, required: true }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password size="large" />
        </Form.Item>

        {/*<Form.Item*/}
        {/*  name="remember"*/}
        {/*  valuePropName="checked"*/}
        {/*  wrapperCol={{ offset: 8, span: 16 }}*/}
        {/*>*/}
        {/*  <Checkbox>Remember me</Checkbox>*/}
        {/*</Form.Item>*/}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
