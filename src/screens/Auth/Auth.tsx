import { Tabs } from 'antd'
import { UserAddOutlined, UserOutlined } from '@ant-design/icons'
import React from 'react'
import { Login } from '@screens/Auth/components/Login'
import { Register } from '@screens/Auth/components/Register'
import { ClientEntity } from '@shared/entities/ClientEntity'

export interface IAuthProps {
  isModal?: boolean
  onSubmit?: (data: ClientEntity) => void
}

export interface TabItem {
  key: string
  label: React.ReactNode
  children: React.ReactNode
}

const authItems: (isModal?: boolean) => TabItem[] = (isModal?: boolean) => [
  {
    label: (
      <span>
        <UserOutlined /> Login
      </span>
    ),
    key: '1',
    children: <Login isModal={isModal} />,
  },
  {
    label: (
      <span>
        <UserAddOutlined /> Registrate
      </span>
    ),
    key: '2',
    children: <Register isModal={isModal} />,
  },
]

export const Auth = ({ isModal }: IAuthProps) => {
  return <Tabs defaultActiveKey="1" items={authItems(isModal)} />
}
