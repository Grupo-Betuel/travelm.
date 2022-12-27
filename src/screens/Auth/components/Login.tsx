import React from 'react'
import { Button, Checkbox, ConfigProvider, Form, Input } from 'antd'

const validateMessages = {
  required: "'${name}' is required bro!",
  // ...
}

export const Login = () => {
  const submit = (data: any) => console.log('form data', data)

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={submit}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="ss"
        rules={[{ type: 'string', pattern: /[A-z]/, required: true, min: 4 }]}
      >
        <Input size="large" />
      </Form.Item>

      <Form.Item label="Password" name="password" rules={[{ required: true }]}>
        <Input.Password size="large" />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
