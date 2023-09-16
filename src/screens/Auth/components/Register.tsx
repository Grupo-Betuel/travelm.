import {
  Alert, Button, Form, Input, Spin,
} from 'antd';
import { useAppStore } from '@services/store';
import { ClientEntity } from '@shared/entities/ClientEntity';
import { MaskedInput } from 'antd-mask-input';
import { useRouter } from 'next/router';
import { IAuthProps } from '@screens/Auth/Auth';
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum';
import React, { useEffect, useState } from 'react';
import { UserAddOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useOrderContext } from '@shared/contexts/OrderContext';

export function Register({ isModal, onSubmit }: IAuthProps) {
  const clientEntity = useAppStore((state) => state.clients((stateu) => stateu));
  const router = useRouter();
  const [clientLoginData, setClientLoginData] = useState<ClientEntity>(
    {} as ClientEntity,
  );
  const { cartIsOpen, toggleCart } = useOrderContext();
  const [failedLogin, setFailedLogin] = useState(false);

  const createClient = async (data: ClientEntity) => {
    data.phone = data.phone.toString().replace(/[- ()+]/g, '');
    const loginData = {
      ...clientLoginData,
      phone: data.phone,
      password: data.password,
    };
    setClientLoginData(loginData);

    const res = await clientEntity.add(data, {
      endpoint: EndpointsAndEntityStateKeys.REGISTER,
    });
    console.log('response', res, clientEntity.error);
    if (res) {
      await handleLogin(loginData);
    }

    return false;
  };

  const handleLogin = async (userData: ClientEntity = clientLoginData) => {
    toast.info('Iniciando sesión...');
    const data: ClientEntity = {
      ...clientLoginData,
      ...userData,
    };

    console.log('login', data);

    const response = await clientEntity.add(data, {
      endpoint: EndpointsAndEntityStateKeys.LOGIN,
    });

    if (!response) {
      handleUnsuccessfulLogin();
    } else {
      setFailedLogin(false);
      if (isModal) {
        router.back();
      } else if (!onSubmit) {
        router.push('/');
      }
    }
    return response;
  };

  const handleUnsuccessfulLogin = () => {
    if (clientEntity.error?.status === 409) {
      toast.error(clientEntity.error.message);
      setFailedLogin(true);
    }
  };

  useEffect(() => {
    if (clientEntity.error?.status === 409) {
      handleLogin();
    }
  }, [clientLoginData, clientEntity?.error]);

  useEffect(() => {
    console.log('clientEntity', clientEntity.item);
    if (onSubmit && clientEntity.item._id) onSubmit(clientEntity.item);
  }, [clientEntity.item]);

  const goToLogin = () => {
    cartIsOpen && toggleCart();
    router.push('/client/auth');
  };

  return (
    <Form
      className="pt-s"
      name="registerUser"
      layout="vertical"
      initialValues={{ remember: true }}
      onFinish={createClient}
    >
      {failedLogin && (
        <Alert
          showIcon
          description="Este número de teléfono ya está registrado."
          type="error"
          action={(
            <Button onClick={goToLogin} size="small" type="primary">
              Iniciar Sesión
            </Button>
          )}
        />
      )}
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
