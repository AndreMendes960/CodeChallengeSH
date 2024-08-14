import { InputText } from "primereact/inputtext"
import { FloatLabel } from 'primereact/floatlabel';
import { Dispatch, SetStateAction } from "react";
import { InputNumber } from "primereact/inputnumber";

type Props = {
    label : string,
    defaultValue : string | null | number,
    onChangeFunction : Dispatch<SetStateAction<any>>,
    field : string,
    invalid? : boolean
    type? : string
}

const FloatingInput = ({label, defaultValue, onChangeFunction, field, invalid = false, type = "text"} : Props) => {
    return(
        <FloatLabel>
            {typeof defaultValue === 'number' ? 
                <InputNumber invalid={invalid} useGrouping={false} value={defaultValue || 0} onValueChange={(e) => onChangeFunction(e.value)} /> 
                :
                <InputText invalid={invalid} value={defaultValue} onChange={(e) => onChangeFunction(e.target.value)} type={type}/>}
            <label htmlFor={field}>{label}</label>
        </FloatLabel>
    )
}

export default FloatingInput