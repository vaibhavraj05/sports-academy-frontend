import { Button, message } from 'antd';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '#/context/AuthProvider';
import axios from '#/api/axios';
import { removeToken } from '#/helpers/token';

const navLinks = [
  {
    key: 'home',
    label: 'Home',
    path: '/'
  },
  {
    key: 'browse',
    label: 'Browse',
    path: '/browse'
  },
  {
    key: 'bookings',
    label: 'Bookings',
    path: '/bookings'
  }
];

export default function Header() {
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
      messageApi.success('Logout successful');
    } catch (error) {
      messageApi.error('Logout Failed. Please try again');
    }
  };

  return (
    <>
      {contextHolder}
      <header className='sticky top-0 z-10 flex w-full items-center justify-between border-b-2 border-gray-400 bg-white p-4'>
        <div className='logo'>
          <Link to='/'>
            <img
              src='https://upload-images-task.s3.amazonaws.com/sports_academy/sports_academy.png'
              alt='logo'
              width={50}
            />
          </Link>
        </div>
        <nav>
          <ul className='mb-0 flex list-none items-center gap-x-5 text-base'>
            {navLinks.map(({ key, label, path }) => (
              <li key={key}>
                <NavLink
                  className={({ isActive }) =>
                    `${isActive ? 'border-b-2' : ''} border-blue-500 p-1 text-black `
                  }
                  key={key}
                  to={path}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
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
      </header>
    </>
  );
}
