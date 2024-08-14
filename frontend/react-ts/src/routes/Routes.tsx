
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import AuthContext, { userDataType } from '../middleware/authContext';

import { useContext } from 'react';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/registerPage/RegisterPage';
import AdminPage from '../pages/adminPage/AdminPage';
import HomePage from '../pages/homePage/HomePage';
import BookPage from '../pages/bookPage/BookPage'
import EditBookPage from '../pages/bookPage/EditBookPage';


const UnauthenticatedRoute = ({ children, userData } : {children : JSX.Element, userData : userDataType | null}) => {
    return (userData === null) ? children : <Navigate to="/" />;
};

const ProtectedRoute = ({ children, userData } : {children : JSX.Element, userData : userDataType | null}) => {
    return (userData !== null && userData.role === "Admin") ? children : <Navigate to="/404" />;
};



const UseRoutes = () => {

    const {userData} = useContext(AuthContext)
    
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<UnauthenticatedRoute userData={userData}><LoginPage></LoginPage></UnauthenticatedRoute>}/>
            <Route path="/register" element={<UnauthenticatedRoute userData={userData}><RegisterPage></RegisterPage></UnauthenticatedRoute>}/>

            <Route path="/" element={<HomePage></HomePage>}/>

            <Route path="/admin" element={<ProtectedRoute userData={userData}><AdminPage></AdminPage></ProtectedRoute>}/>
            <Route path="/book/:id" element={<BookPage></BookPage>} />

            <Route path="/book/:id/edit" element={<ProtectedRoute userData={userData}><EditBookPage></EditBookPage></ProtectedRoute>} />
        </Routes>
    </BrowserRouter>
)};

export default UseRoutes