import axios from 'axios'

const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"

const axiosInstance = axios.create({
    baseURL: serverUrl,
    withCredentials: true
})

// Add token to requests if it exists in localStorage
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default axiosInstance
