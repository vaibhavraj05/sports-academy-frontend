import { Button, Layout, Menu, Space, Spin, theme } from 'antd';
import { Suspense } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const navLinks = [
  {
    key: 'home',
    label: <Link to='/'>Home</Link>
  },
  {
    key: 'browse',
    label: <Link to='/browse'>Browse</Link>
  },
  {
    key: 'about',
    label: <Link to='/about'>About</Link>
  }
];

function AppLayout() {
  const {
    token: { colorBgContainer }
  } = theme.useToken();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentPath = pathname.split('/')[1] || 'home';

  return (
    <Layout className='layout' style={{ minHeight: '100%' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          paddingInline: 20,
          display: 'flex',
          justifyContent: 'space-between',
          background: colorBgContainer
        }}
      >
        <div className='logo'>
          <Link to='/'>
            <img
              src='https://upload-images-task.s3.amazonaws.com/sports_academy/sports_academy.png'
              alt='logo'
              width={50}
            />
          </Link>
        </div>
        <Menu
          mode='horizontal'
          style={{ flex: 1, justifyContent: 'center' }}
          items={navLinks}
          selectedKeys={[currentPath]}
        />
        <Space>
          <Button type='primary' onClick={() => navigate('login')}>
            LogIn
          </Button>
          <Button onClick={() => navigate('register')}>Register</Button>
        </Space>
      </Header>
      <Content style={{ padding: '10px 10px 0', display: 'flex', flexDirection: 'column' }}>
        <Suspense
          fallback={
            <div
              style={{
                height: '100%',
                background: colorBgContainer,
                flex: 1,
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <Spin size='large' tip='Loading' />
            </div>
          }
        >
          <div
            className='site-layout-content'
            style={{ background: colorBgContainer, flex: 1, padding: 10 }}
          >
            <Outlet />
          </div>
        </Suspense>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Sports Academy ©2023 Created by Team 07</Footer>
    </Layout>
  );
}

export default AppLayout;
