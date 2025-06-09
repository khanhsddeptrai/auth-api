import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Trang Chủ
            </Typography>
            <Typography paragraph>
                Chào mừng đến với ứng dụng Vite + React + TypeScript + MUI!
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/about">
                Đi đến trang Giới Thiệu
            </Button>
        </div>
    );
}

export default Home;