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
    key: 'about',
    label: 'About',
    path: '/about'
  }
];

export default function Header() {
  const [messageApi, contextHolder] = message.useMessage();

  const { auth, setAuth } = useAuth();
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
      <header className='sticky top-0 z-10 p-4 w-full flex items-center justify-between bg-white border-b-2 border-gray-400'>
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
          <ul className='flex gap-x-5 items-center mb-0 text-base list-none'>
            {navLinks.map(({ key, label, path }) => (
              <li>
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
        <div className='flex gap-x-3'>
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
        </div>
      </header>
    </>
  );
}
