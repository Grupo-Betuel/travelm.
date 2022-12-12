import { Navbar } from "@shared/layout/components/Navbar/Navbar";
import { Sidebar } from "@shared/layout/components/Sidebar";
import { Layout } from "antd";
import { AppFooter } from "@shared/layout/components/Footer";
import { Content } from "antd/lib/layout/layout";

export interface IAppLayoutProps {
  children: any;
}
const AppLayout = ({ children }: IAppLayoutProps) => {
  return (
    <>
      <Layout>
        <Navbar />
        <Layout>
          {/*<FiltersSidebar />*/}
          <Content>{children}</Content>
        </Layout>
        {/*<AppFooter />*/}
      </Layout>
    </>
  );
};

export default AppLayout;
