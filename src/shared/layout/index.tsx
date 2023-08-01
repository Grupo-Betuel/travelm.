import { Navbar } from '@shared/layout/components/Navbar/Navbar';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import styles from './layout.module.scss';
import { layoutId } from '../../utils/layout.utils';

export interface IAppLayoutProps {
  children: any
}
function AppLayout({ children }: IAppLayoutProps) {
  return (
    <Layout className={styles.layout} id={layoutId}>
      <Navbar />
      <Layout>
        {/* <FiltersSidebar /> */}
        <Content className={styles.content}>{children}</Content>
      </Layout>
      {/* <AppFooter /> */}
    </Layout>
  );
}

export default AppLayout;
