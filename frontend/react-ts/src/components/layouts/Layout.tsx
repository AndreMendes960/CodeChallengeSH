import styles from "./Layout.module.scss"

type Props = {
    children: JSX.Element,
  };


const Layout = ({children}:Props) =>{
    return(
        <div className={styles.appContainer}>
            {children}
        </div>
    )
}

export default Layout