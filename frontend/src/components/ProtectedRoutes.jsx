import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = ({isAuth}) =>{
    return (
        isAuth ? <Outlet/> : <Navigate to={'/auth'}/>
    )
}

export default ProtectedRoutes