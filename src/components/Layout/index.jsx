import { Layout, Spin } from 'antd';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '#/components/Header';

const { Content, Footer } = Layout;

function AppLayout() {
  return (
    <Layout className='layout' style={{ minHeight: '100%' }}>
      <Header />
      <Content style={{ padding: '10px 10px 0', display: 'flex', flexDirection: 'column' }}>
        <Suspense
          fallback={
            <div className='h-full bg-white flex-1 grid place-items-center'>
              <Spin size='large' tip='Loading' />
            </div>
          }
        >
          <div className='bg-white flex-1 p-5'>
            <Outlet />
          </div>
        </Suspense>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Sports Academy ©2023 Created by Team 7</Footer>
    </Layout>
  );
}

export default AppLayout;
