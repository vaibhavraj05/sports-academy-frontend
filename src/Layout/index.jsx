import axios from '#/api/axios';
import { useAuth } from '#/context/AuthProvider';
import { removeToken } from '#/helpers/token';
import { Button, Layout, Menu, Space, Spin, message } from 'antd';
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
  const [messageApi, contextHolder] = message.useMessage();

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentPath = pathname.split('/')[1] || 'home';

  const handleLogout = async () => {
    try {
      await axios.post('user/logout');
      setAuth({});
      removeToken();
      messageApi.success('Logout successful');
    } catch (error) {
      messageApi.error('Logout Failed. Please try again');
    }
  };

  return (
    <>
      {contextHolder}
      <Layout className='layout' style={{ minHeight: '100%' }}>
        <Header className='sticky top-0 z-10 px-4 w-full flex justify-between bg-white'>
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
            {auth?.accessToken ? (
              <Button type='primary' onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button type='primary' onClick={() => navigate('login')}>
                  LogIn
                </Button>
                <Button onClick={() => navigate('register')}>Register</Button>
              </>
            )}
          </Space>
        </Header>
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
    </>
  );
}

export default AppLayout;
