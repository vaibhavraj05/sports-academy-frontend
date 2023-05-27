import axios from '#/api/axios';
import { useAuth } from '#/context/AuthProvider';
import { removeToken } from '#/helpers/token';
import { HomeFilled } from '@ant-design/icons';
import { Button, Layout, Menu, message, theme } from 'antd';
import { createElement } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const items = [HomeFilled].map((icon, index) => ({
  key: String(index + 1),
  icon: createElement(icon),
  label: 'Home'
}));
function AdminLayout() {
  const {
    token: { colorBgContainer }
  } = theme.useToken();

  const [messageApi, contextHolder] = message.useMessage();

  const { auth, setAuth } = useAuth();
  const { accessToken, name, email } = auth || {};
  const firstName = name?.split(' ')[0];

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('user/logout');
      setAuth({});
      removeToken();
      navigate('/', { replace: true });
      messageApi.success('Logout successful');
    } catch (error) {
      messageApi.error('Logout Failed. Please try again');
    }
  };

  return (
    <>
      {contextHolder}
      <Layout hasSider style={{ height: '100%' }}>
        <Sider className='!fixed bottom-0 left-0 top-0 h-screen overflow-auto'>
          <div className='mb-5 py-3 text-center text-xl font-bold text-sky-500'>Sports Academy</div>
          <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']} items={items} />
        </Sider>
        <Layout className='site-layout ml-[200px]'>
          <Header
            style={{
              padding: 10,
              background: colorBgContainer,
              display: 'flex',
              justifyContent: 'end'
            }}
          >
            <div className='flex items-center gap-x-3'>
              <p title={email} className='text-base font-medium text-sky-700 underline'>
                {firstName}
              </p>
              {accessToken ? (
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
            </div>
          </Header>
          <Content className='mt-1 overflow-visible'>
            <Outlet />
          </Content>
          <Footer className='text-center'>Ant Design ©2023 Created by Team 7</Footer>
        </Layout>
      </Layout>
    </>
  );
}
export default AdminLayout;
