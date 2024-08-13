import { Dispatch, SetStateAction } from "react"
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';

type Props = {
    label : string,
    defaultValue : string,
    onChangeFunction : Dispatch<SetStateAction<any>>,
    type? : string,
}

const Input = ({label, defaultValue, onChangeFunction, type} : Props) =>{
    return(
        <div className="card flex justify-content-center">
            <FloatLabel>
                <InputText id="username" value={defaultValue} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    onChangeFunction(event.target.value);
            }} />
                <label htmlFor="username">{label}</label>
            </FloatLabel>
        </div>
    )
}

export default Input