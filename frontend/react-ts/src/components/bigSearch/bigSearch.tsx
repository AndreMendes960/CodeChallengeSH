
import Input from "../input/Input";
import styles from "./bigSearch.module.scss"

type searchObjectType = {
    label: string;
    value: string;
    setState: React.Dispatch<React.SetStateAction<string>>;
}

type Props = {searchArray : searchObjectType[], button : React.ReactNode}

const BigSearch = ({searchArray, button} : Props) => {

    return (
        <div className={styles.wrapperDiv}>
            {searchArray.map((param) => {
                return(
                    <div className={styles.itemDiv}>
                        <Input label={param.label} defaultValue={param.value} onChangeFunction={param.setState}></Input>
                    </div>
                )
            })}

            <div className={styles.buttonDiv}>
                {button}
            </div>
            
        </div>
    );
    
}

export default BigSearch;