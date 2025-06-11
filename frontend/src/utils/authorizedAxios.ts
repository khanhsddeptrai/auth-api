import axios from 'axios'
import { toast } from 'react-toastify'

let authorizedAxiosInstance = axios.create()
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10 // 10 minutes
// authorizedAxiosInstance.defaults.withCredentials = true // allow cookies to be sent with requests

authorizedAxiosInstance.interceptors.request.use((config) => {
    // Do something before request is sent
    const accessToken = localStorage.getItem('accessToken')
    console.log("interceptor token: ", accessToken)
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
}, (error) => {
    // Do something with request error
    return Promise.reject(error)
});

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
}, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(error.response?.status)
    if (error.response?.status !== 410) {
        console.log(error)
        toast.error(error.response?.data?.message || error?.message)
    }
    return Promise.reject(error)
});

export default authorizedAxiosInstance