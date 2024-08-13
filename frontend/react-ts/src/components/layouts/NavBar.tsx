import {useContext, useState} from "react"
import { useTranslation } from "react-i18next";
import {MdHelp, MdLogout, MdPerson3, MdWifi} from "react-icons/md"

import { UserContext, ModeDispatchContext } from "../utils/userContext";
import SwitchButton from "../components/common/SwitchButton";

import styles from "./NavBar.module.scss"
import TransparentButtonDropDown from "../components/common/TransparentDropDown/TransparentButtonDropDown";
import DropDownOption from "../components/common/DropDownOption";
import TransparentRoundHoverButton from "../components/common/TransparentRoundHoverButton";
import Help from "../components/help/Help";
import Backdrop from "../components/common/Modal/Backdrop";

import logo from "../../public/nav_logo.jpg"



const NavBar = () =>{

    const {mode, userData} = useContext(UserContext)
    const dispatch = useContext(ModeDispatchContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {t} = useTranslation()

    const handleChange = () =>{
        dispatch({type : 'TOGGLE_MODE'})
    }

    const logout = () => {
        dispatch({type : 'LOGOUT'})
    }

    return(
        <div className={styles.navBar}>
            <img src={logo} alt={t("ALTICE_LABS_LOGO") || "Logo"} className={styles.logoImg}></img>
            <div className={styles.actionsDiv}>
                <TransparentRoundHoverButton customClassname={{margin : "0", width : "30px", height : "30px", marginRight : "1rem"}} onClick={()=>setIsModalOpen(true)}>
                    <MdHelp style={{width : "20px", height : "20px"}} ></MdHelp>
                </TransparentRoundHoverButton>
                <TransparentButtonDropDown>
                    <div className={styles.dropDownProfileWrapper}>
                        <div className={styles.userDataDiv}>
                            <div className={styles.iconLabelDiv}>
                                <MdPerson3 className={styles.icon}></MdPerson3>
                                <p className={styles.usernameLabel}>{userData.name}</p>
                            </div>  
                            <p className={styles.userEmailLabel}>{userData.email}</p>
                        </div>
                        <DropDownOption action={handleChange} customClassname={{paddingRight : "0", paddingLeft:"0"}}>
                            <div className={styles.iconLabelDiv}>
                                <MdWifi className={styles.icon}></MdWifi>
                                <div className={styles.alignDiv}>
                                    <p className={styles.optionLabel}>{t("SIMULATION_MODE")}</p>
                                    <SwitchButton
                                        checked={mode === "simulation"}
                                        handleChange={handleChange}
                                    />
                                </div>
                            </div>
                            
                        </DropDownOption>
                        {<DropDownOption customClassname={{paddingRight : "0", paddingLeft:"0"}}> 
                            <div className={styles.iconLabelDiv} onClick={()=>logout()}>
                                <MdLogout className={styles.icon}></MdLogout>
                                <p className={styles.optionLabel}>{t("LOG_OUT")} </p>
                            </div>
                        </DropDownOption>}
                    </div>
                </TransparentButtonDropDown>
            </div>
            {isModalOpen && <Help onClose={()=>setIsModalOpen(false)}></Help>}
            {isModalOpen && <Backdrop onClick={()=>{setIsModalOpen(false) }}></Backdrop>}
        </div>

    )
}

export default NavBar