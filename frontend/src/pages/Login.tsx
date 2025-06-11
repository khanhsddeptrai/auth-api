import { useForm, type SubmitHandler } from 'react-hook-form';
import { Box, Button, TextField, Alert, Typography, Card as MuiCard, CardActions, Zoom } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import authorizedAxiosInstance from '../utils/authorizedAxios';
import { toast } from 'react-toastify';

interface LoginFormInputs {
    email: string;
    password: string;
}

interface LoginResponse {
    statusCode: number;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        payload?: {
            userId: string;
            email: string;
        }
    }
}

function LoginForm() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        const res = await authorizedAxiosInstance.post<LoginResponse>(`http://localhost:8080/api/auth/login`, data);
        const loginData = res.data
        localStorage.setItem('accessToken', loginData.data.accessToken);
        localStorage.setItem('refreshToken', loginData.data.refreshToken);
        toast.success(loginData.message)
        navigate('/user');
        console.log('Response:', loginData);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: 'url("/src/assets/backgroundLogin.jpg")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.4)',
        }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                    <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em', p: '0.5em 0', borderRadius: 2 }}>
                        <Box sx={{ padding: '0 1em 1em 1em' }}>
                            <Typography variant="h5" sx={{ textAlign: 'center', mb: '1em' }}>
                                Đăng Nhập
                            </Typography>
                            <Box sx={{ marginTop: '1.2em' }}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    label="Email"
                                    type="text"
                                    variant="outlined"
                                    error={!!errors.email}
                                    {...register('email', {
                                        required: 'Email là bắt buộc',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'Email không hợp lệ',
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <Alert severity="error" sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                                        {errors.email.message}
                                    </Alert>
                                )}
                            </Box>
                            <Box sx={{ marginTop: '1em' }}>
                                <TextField
                                    fullWidth
                                    label="Mật khẩu"
                                    type="password"
                                    variant="outlined"
                                    error={!!errors.password}
                                    {...register('password', {
                                        required: 'Mật khẩu là bắt buộc',
                                        minLength: {
                                            value: 6,
                                            message: 'Mật khẩu phải có ít nhất 6 ký tự',
                                        },
                                    })}
                                />
                                {errors.password && (
                                    <Alert severity="error" sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                                        {errors.password.message}
                                    </Alert>
                                )}
                            </Box>
                        </Box>
                        <CardActions sx={{ padding: '0.5em 1em 1em 1em' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                            >
                                Đăng Nhập
                            </Button>
                        </CardActions>
                        <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
                            <Typography>
                                Chưa có tài khoản?{' '}
                                <Button component={Link} to="/register">
                                    Đăng Ký
                                </Button>
                            </Typography>
                        </Box>
                    </MuiCard>
                </Zoom>
            </form>
        </Box>
    );
}

export default LoginForm;