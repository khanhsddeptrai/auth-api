import React, { useEffect, useState } from "react";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    full_name: string;
    email: string;
    is_active: boolean;
}

interface UserDataRespone {
    statusCode: number;
    message: string;
    data: User[]
}

function UserPage(): React.ReactElement {
    const [listUser, setListUser] = useState<User[]>([])
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        console.log("token from userpage: ", accessToken)
        const fetchUserData = async () => {
            try {
                const res = await authorizedAxiosInstance.get<UserDataRespone>(`http://localhost:8080/api/users/get-all`);
                console.log('User Data:', res.data);
                setListUser(res.data.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Không thể lấy danh sách người dùng, vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    function handleLogout(): void {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userInfo')
        setListUser([])
        navigate('/login')
    }

    if (loading) {
        return <p>Đang tải dữ liệu người dùng...</p>;
    }

    return (
        <div>
            <h1>User Page</h1>
            <ul>
                {listUser.map((user) => (
                    <li key={user.id}>
                        <strong>Name:</strong> {user.full_name} <br />
                        <strong>Email:</strong> {user.email}
                        <hr />
                    </li>
                ))}
            </ul>
            <Button
                type="button"
                variant="contained"
                color="info"
                size="large"
                sx={{ mt: 2, maxWidth: 'min-content', alignSelf: 'flex-end' }}
                onClick={handleLogout}
            >
                Logout
            </Button>
        </div>
    )
}

export default UserPage;