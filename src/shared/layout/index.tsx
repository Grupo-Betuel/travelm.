import { Navbar } from '@shared/layout/components/Navbar/Navbar'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import styles from './layout.module.scss'

export interface IAppLayoutProps {
  children: any
}
const AppLayout = ({ children }: IAppLayoutProps) => {
  return (
    <>
      <Layout className={styles.layout}>
        <Navbar />
        <Layout>
          {/*<FiltersSidebar />*/}
          <Content className={styles.content}>{children}</Content>
        </Layout>
        {/*<AppFooter />*/}
      </Layout>
    </>
  )
}

export default AppLayout
