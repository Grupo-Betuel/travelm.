import Sider from 'antd/lib/layout/Sider';
import { useRef, useState } from 'react';
import { Affix } from 'antd';
import {
  layoutId,
  navbarOptionsHeight,
  sidebarId,
} from '../../../../utils/layout.utils';
import styles from './Sidebar.module.scss';

const footerName = 'StickyFooter';
export interface ISidebarProps {
  children?: any
  className?: string
  expanded?: boolean
}

export function Sidebar({ children, className, expanded }: ISidebarProps = { children: [] }) {
  const sidebarRef = useRef<HTMLDivElement>();
  const [enableSidebarOptionHiddenHeight, setEnableSidebarOptionHiddenHeight] = useState<boolean>();

  function SidebarFooter() {
    return (
      <>
        {children?.find
        && children?.find((item: any, i: number) => {
          const found = item.type.name === footerName;
          return found;
        })}
      </>
    );
  }

  return (
    <Sider
      className={`${styles.Sidebar} ${expanded ? styles.SidebarExpanded : ''}`}
      ref={sidebarRef as any}
    >
      <Affix
        className={styles.SidebarAffix}
        offsetTop={navbarOptionsHeight}
        target={() => document.getElementById(layoutId)}
        onChange={setEnableSidebarOptionHiddenHeight}
      >
        <div
          className={`${className} ${styles.SidebarWrapper} ${
            enableSidebarOptionHiddenHeight
              ? styles.HiddenNavbarOptionsHeight
              : ''
          }`}
          id={sidebarId}
        >
          <div className={styles.SidebarContent}>
            {children?.filter
              ? children?.filter((item: any) => item.type.name !== footerName)
              : children}
          </div>
          <SidebarFooter />
        </div>
      </Affix>
    </Sider>
  );
}
