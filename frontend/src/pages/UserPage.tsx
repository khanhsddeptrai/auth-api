import React, { useEffect, useState } from "react";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { toast } from "react-toastify";

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
        </div>
    )
}

export default UserPage;