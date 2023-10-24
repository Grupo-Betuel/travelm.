import { Tabs } from 'antd';
import { UserAddOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { Login } from '@screens/Auth/components/Login';
import { Register } from '@screens/Auth/components/Register';
import { ClientEntity } from '@shared/entities/ClientEntity';
import OrderEntity from '@shared/entities/OrderEntity';

export interface IAuthProps {
  isModal?: boolean;
  onSubmit?: (data: ClientEntity, order?: OrderEntity) => void;
  submitBtnLabel?: string;
}

export interface TabItem {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
}

const authItems: (isModal?: boolean) => TabItem[] = (isModal?: boolean) => [
  {
    label: (
      <span>
        <UserOutlined rev="" />
        {' '}
        Login
      </span>
    ),
    key: '1',
    children: <Login isModal={isModal} />,
  },
  {
    label: (
      <span>
        <UserAddOutlined rev="" />
        {' '}
        Registrate
      </span>
    ),
    key: '2',
    children: <Register isModal={isModal} />,
  },
];

export function Auth({ isModal }: IAuthProps) {
  return <Tabs defaultActiveKey="1" items={authItems(isModal)} />;
}
