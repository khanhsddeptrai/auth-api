import React, { useEffect } from "react";
import authorizedAxiosInstance from "../utils/authorizedAxios";

function UserPage(): React.ReactElement {
    // interface UserDataRespone {
    //     statusCode: number;
    //     message: string;
    //     data: []
    // }
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await authorizedAxiosInstance.get(`http://localhost:8080/api/users/get-all`)
                console.log('User Data:', res.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData()
    }, [])

    return (
        <div>
            <h1>User Page</h1>
            <p>This is the user page where you can view user-specific information.</p>
        </div>
    )
}

export default UserPage;