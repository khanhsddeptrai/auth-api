import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Home from './pages/Home.tsx';
import UserPage from './pages/UserPage.tsx';
import NotFound from './pages/NotFound.tsx';

function App() {
  return (
    <Container sx={{ margin: 0, padding: 0 }} disableGutters={true} maxWidth={false}>
      <Routes >
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/user' element={<UserPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Container>
  );
}

export default App;