import {
  Button, Form, Input, Select, Spin,
} from 'antd';
import { useAppStore } from '@services/store';
import { ClientEntity } from '@shared/entities/ClientEntity';
import { MaskedInput } from 'antd-mask-input';
import { useRouter } from 'next/router';
import { IAuthProps } from '@screens/Auth/Auth';
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum';
import React from 'react';
import { SendOutlined, UserAddOutlined } from '@ant-design/icons';

export function Register({ isModal, onSubmit }: IAuthProps) {
  const clientEntity = useAppStore((state) => state.clients((stateu) => stateu));
  const router = useRouter();

  const createClient = async (data: ClientEntity) => {
    data.phone = data.phone.toString().replace(/[- ()+]/g, '');
    if (
      await clientEntity.add(data, {
        endpoint: EndpointsAndEntityStateKeys.REGISTER,
      })
    ) {
      if (
        await clientEntity.add(
          {
            phone: data.phone,
            password: data.password,
          },
          { endpoint: EndpointsAndEntityStateKeys.LOGIN },
        )
      ) {
        if (onSubmit) return onSubmit(data);
        if (isModal) {
          router.back();
        } else {
          router.push('/');
        }
      }
    } else {
      // router.push('/auth')
    }
  };

  return (
    <Form
      className="pt-s"
      name="registerUser"
      layout="vertical"
      initialValues={{ remember: true }}
      onFinish={createClient}
    >
      {clientEntity.loading && (
        <div className="loading">
          <Spin size="large" />
        </div>
      )}
      <Form.Item label="Nombre" name="firstName" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item label="Apellido" name="lastName" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item
        label="Whatsappp"
        name="phone"
        rules={[{ type: 'string', required: true, min: 17 }]}
      >
        <MaskedInput
          type="text"
          value=""
          mask="+1 (000) 000-0000"
          maskOptions={{
            lazy: true,
          }}
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
          icon={<UserAddOutlined rev="" />}
        >
          Registrarse
        </Button>
      </Form.Item>
    </Form>
  );
}
