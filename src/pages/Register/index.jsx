import { Button, Card, Form, Input, Spin, Typography, message } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '#/context/AuthProvider';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from '#/api/axios';
import { setToken } from '#/helpers/token';
import { Container } from '#/components/Common';

const { Title } = Typography;

function Register() {
  const { auth, setAuth } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: (value) => axios.post('/user', value),
    onSuccess: (res) => {
      const { id, name, email, tokens } = res.data.data;
      const { accessToken, refreshToken } = tokens;
      setAuth({ id, name, email, accessToken, refreshToken });
      setToken(tokens);
      messageApi.success('Account created successfully');
      navigate('/');
    },
    onError: (error) => {
      messageApi.error(error?.response?.data?.message);
    }
  });

  if (auth?.accessToken) {
    return <Navigate to='/' replace />;
  }

  return (
    <>
      {contextHolder}
      <Container>
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
            <Title style={{ textAlign: 'center' }}>Register</Title>
            <Form
              name='normal_login'
              initialValues={{ remember: true }}
              onFinish={mutate}
              size='large'
            >
              <Form.Item
                name='name'
                rules={[{ required: true, message: 'Please input your Name!' }]}
              >
                <Input
                  prefix={<UserOutlined className='site-form-item-icon' />}
                  placeholder='Name'
                />
              </Form.Item>
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

              <Form.Item style={{ textAlign: 'center', marginTop: 40 }}>
                <Button type='primary' htmlType='submit' block style={{ marginBottom: 10 }}>
                  Register
                </Button>
                Already a user? <Link to='/login'>Login</Link>
              </Form.Item>
            </Form>
          </Card>
        </Spin>
      </Container>
    </>
  );
}

export default Register;
