//import {useContext} from "react"
//import {MdHelp, MdLogout, MdPerson3, MdWifi} from "react-icons/md"

//import AuthContext from "../../middleware/authContext";
//import SwitchButton from "../components/common/SwitchButton";

import styles from "./NavBar.module.scss"
//import TransparentButtonDropDown from "../components/common/TransparentDropDown/TransparentButtonDropDown";
//import DropDownOption from "../components/common/DropDownOption";
//import TransparentRoundHoverButton from "../components/common/TransparentRoundHoverButton";



const NavBar = () =>{

    //const {userData, logout} = useContext(AuthContext)

    return(
        <div className={styles.navBar}>
            <div className={styles.actionsDiv}>
                {/* <TransparentRoundHoverButton customClassname={{margin : "0", width : "30px", height : "30px", marginRight : "1rem"}} onClick={()=>setIsModalOpen(true)}>
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
                    
                        {<DropDownOption customClassname={{paddingRight : "0", paddingLeft:"0"}}> 
                            <div className={styles.iconLabelDiv} onClick={()=>logout()}>
                                <MdLogout className={styles.icon}></MdLogout>
                                <p className={styles.optionLabel}>{t("LOG_OUT")} </p>
                            </div>
                        </DropDownOption>}
                    </div>
                </TransparentButtonDropDown> */}
                Navbar
            </div>
        </div>

    )
}

export default NavBar