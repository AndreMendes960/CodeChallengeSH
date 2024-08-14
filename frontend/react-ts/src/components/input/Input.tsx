import { ChangeEvent, Dispatch, SetStateAction } from "react"

import styles from "./Input.module.scss"

type Props = {
    label : string,
    defaultValue : string,
    onChangeFunction : Dispatch<SetStateAction<any>>,
    type? : string,
}

const Input = ({label, defaultValue, onChangeFunction, type} : Props) =>{
    
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChangeFunction(event.target.value);
    };

    return(
        <div className={styles.wrapper}>
            <input className={styles.input} placeholder={label} value={defaultValue} type={type ?? "text"} onChange={handleChange}/>
            <span className={styles.underline}></span>
        </div>

    )
}

export default Input


