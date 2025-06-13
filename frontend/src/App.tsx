import { Container } from '@mui/material';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Home from './pages/Home.tsx';
import UserPage from './pages/UserPage.tsx';
import NotFound from './pages/NotFound.tsx';
import type { JSX } from 'react';

interface UserInfo {
  id: number;
  email: string
}

const ProtectedRoutes = (): JSX.Element => {
  const userInfo = localStorage.getItem('userInfo')
  let user: UserInfo | null = null;
  if (userInfo) {
    try {
      user = JSON.parse(userInfo)
    } catch (error) {
      console.error('Error parsing userInfo:', error);
    }
  }
  if (!user) {
    return <Navigate to='/login' replace={true} />
  }
  return <Outlet />
}

const UnAuthorizedRoutes = (): JSX.Element => {
  const userInfo = localStorage.getItem('userInfo')
  let user: UserInfo | null = null;
  if (userInfo) {
    try {
      user = JSON.parse(userInfo) as UserInfo
    } catch (error) {
      console.error('Error parsing userInfo:', error);
    }
  }
  if (user) {
    return <Navigate to='/' replace={true} />
  }
  return <Outlet />
}

function App() {
  return (
    <Container sx={{ margin: 0, padding: 0 }} disableGutters={true} maxWidth={false}>
      <Routes >
        <Route path='/' element={<Home />} />

        {/* <Route element={<UnAuthorizedRoutes />}>
          
        </Route> */}
        <Route path='/login' element={<Login />} />

        <Route element={<ProtectedRoutes />}>
          <Route path='/user' element={<UserPage />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </Container>
  );
}

export default App;