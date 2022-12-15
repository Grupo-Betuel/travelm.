import { MenuProps, Tabs } from "antd";
import { UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { spans } from "next/dist/build/webpack/plugins/profiling-plugin";
import React from "react";
import { Login } from "@screens/Auth/components/Login";
import { Register } from "@screens/Auth/components/Register";

export interface TabItem {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
}

const authItems: TabItem[] = [
  {
    label: <span><UserOutlined /> Login</span>,
    key: "1",
    children: <Login />
  },
  {
    label: <span><UserSwitchOutlined /> Register</span>,
    key: "2",
    children: <Register />
  }
];

export const Auth = () => {
  return (
    <div>
      <Tabs
        defaultActiveKey="2"
        items={authItems}
      />
    </div>
  );
};