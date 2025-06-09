import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                404 - Không Tìm Thấy Trang
            </Typography>
            <Typography paragraph>
                Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/">
                Quay lại Trang Chủ
            </Button>
        </div>
    );
}

export default NotFound;