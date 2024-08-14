import {useContext} from "react"

import AuthContext from "../../middleware/authContext";

import { Menubar } from "primereact/menubar";
import styles from "./NavBar.module.scss"
import CustomButton from "../Button";
import { useNavigate } from "react-router-dom";




const NavBar = () =>{

    const {userData, logout} = useContext(AuthContext)
    const navigate = useNavigate()

    const start = <p className={styles.titleLabel}>Book Management App</p>;
    
    const items = (userData !== null && userData?.role === 'Admin') ? 
    [
        {
            label: 'Home',
            url: '/'
        },
        {
            label: 'Administration',
            url: '/admin'
        }
    ] : 
    [
        {
            label: 'Home',
            url: '/'
        }
    ];

    const end = (userData!== null && userData.token !== null) ? 
        <div className={styles.actionsDiv}>
            <p className={styles.titleLabel}>Hello {userData?.username}</p> 
            <CustomButton label="Log out" eventHandler={() => logout()}></CustomButton>
        </div>
    :
    (
        <CustomButton label="Log in" link eventHandler={() => navigate("/login")}></CustomButton>
    )

    return (
        <div className="card">
            <Menubar model={items} start={start} end={end}/>
        </div>
    )
}

export default NavBar