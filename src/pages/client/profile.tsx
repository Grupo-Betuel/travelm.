import { ClientEntity } from '@shared/entities/ClientEntity';
import { Button, Form, Input } from 'antd';
import { MaskedInput } from 'antd-mask-input';
import { UserOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { useAuthClientHook } from '@shared/hooks/useAuthClientHook';
import { useAppStore } from '@services/store';
import { useForm } from 'antd/lib/form/Form';
import { toast } from 'react-toastify';

export default function ClientProfile() {
  const clientEntity = useAppStore((state) => state.clients((stateu) => stateu));
  const { client } = useAuthClientHook();
  const [profileForm] = useForm();

  useEffect(() => {
    profileForm.setFieldsValue({
      ...client,
      phone: client?.phone,
    });
  }, [client]);

  const updateClient = async (data: ClientEntity) => {
    data._id = client?._id || '';
    data.phone = Number(data.phone.toString().replace(/[- ()]/g, ''));
    if (await clientEntity.update(data)) {
      toast.success('Perfil actualizado');
    }
  };

  return (
    <Form
      form={profileForm}
      className="p-xxx-l"
      name="registerUser"
      layout="vertical"
      // initialValues={client}
      onFinish={updateClient}
      // onChange={(e) => {}}
      onValuesChange={(e) => console.log('values', e)}
    >
      <Form.Item label="Nombre" name="firstName" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item label="Apellido" name="lastName" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>

      <Form.Item
        label="Whatsapp"
        name="phone"
        rules={[
          {
            type: 'string',
            required: true,
            min: 17,
          },
        ]}
      >
        <MaskedInput
          type="text"
          name="phone"
          mask="+1 (000) 000-0000"
          maskOptions={{
            lazy: true,
          }}
          size="large"
        />
      </Form.Item>
      {/* <Form.Item label="Password" name="password" rules={[{ required: true }]}> */}
      {/*  <Input.Password size="large" /> */}
      {/* </Form.Item> */}
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: false, type: 'email' }]}
      >
        <Input type="email" size="large" />
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
          Actualizar Usuario
        </Button>
      </Form.Item>
    </Form>
  );
}

export const getServerSideProps = async () => ({
  props: {
    protected: true,
  },
});
