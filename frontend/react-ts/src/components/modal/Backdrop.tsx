import styles from "./Modal.module.scss"

type Props = {
    onClick : Function
}

function Backdrop({onClick} : Props)
{
    return( <div className={styles.backdrop} onClick={() => onClick()} aria-hidden="true" onKeyDown={() => {}}/>);
}
export default Backdrop;