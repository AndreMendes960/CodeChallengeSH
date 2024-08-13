import NavBar from "./NavBar";
import Layout from "./Layout";

import styles from "./MainLayout.module.scss"


type Props = {
    children: JSX.Element,
  };


const MainLayout = ({children}:Props) =>{


    return(
        <Layout>
            <>
                <NavBar></NavBar>
                <div className={styles.appBody} >
                    {children}
                </div>
            </>
        </Layout>
    )
}

export default MainLayout