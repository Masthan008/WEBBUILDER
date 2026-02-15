import axiosInstance from '../utils/axios'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function useGetCurrentUser() {
    const dispatch=useDispatch()
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
              const result=await axiosInstance.get('/api/user/me')
              dispatch(setUserData(result.data))
            } catch (error) {
console.log(error)
            }
        }
        getCurrentUser()
    }, [])
}

export default useGetCurrentUser
