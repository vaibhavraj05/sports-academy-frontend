import { Button, Card, Form, Input, Spin, Typography, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '#/context/AuthProvider';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setToken } from '#/helpers/token';
import { useState } from 'react';

const { Title } = Typography;

function Login() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const from = location.state?.from?.pathname || '/';
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/user/login`, values);
      const { id, name, email, tokens } = response.data.data;
      const { refreshToken, accessToken } = tokens;
      setToken(tokens);
      setAuth({ id, name, email, refreshToken, accessToken });
      navigate(from, { replace: true });
    } catch (error) {
      if (error) {
        messageApi.error(error?.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (auth?.accessToken) {
    return <Navigate to={from} replace />;
  }

  return (
    <>
      {contextHolder}
      <Spin spinning={isLoading}>
        <Card
          style={{
            width: '100%',
            maxWidth: 500,
            margin: '50px auto 0',
            boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
            background: '#f5f3f3'
          }}
        >
          <Title style={{ textAlign: 'center' }}>LogIn</Title>
          <Form
            name='normal_login'
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size='large'
          >
            <Form.Item
              name='email'
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input
                prefix={<MailOutlined className='site-form-item-icon' />}
                placeholder='Email'
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className='site-form-item-icon' />}
                type='password'
                placeholder='Password'
              />
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                <p>
                  Not a member? <Link to='/register'>Register now!</Link>
                </p>
                <Link to='any'>Forgot password!</Link>
              </div>
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
              <Button type='primary' htmlType='submit' block>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </>
  );
}

export default Login;
