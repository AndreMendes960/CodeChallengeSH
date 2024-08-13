import styles from './LoadingButton.module.scss'

type Props = {
    label : string,
    loading : boolean,
    type ? : "button" | "submit" | "reset" 
}

const LoadingButton = ({label, loading, type} : Props) =>{
    return (
        <button type={type ?? "button"} className={`${styles.button} ${loading && styles.button_loading}`} >
            <span className={styles.button_text}>{label}</span>
        </button>
    )
}

export default LoadingButton