import { Dispatch, SetStateAction } from "react"
import { TextField } from "@mui/material"

type Props = {
    label : string,
    defaultValue : string,
    onChangeFunction : Dispatch<SetStateAction<any>>,
    type? : string,
}

const Input = ({label, defaultValue, onChangeFunction, type} : Props) =>{
    return(
        <TextField label={label} variant="filled" type={type}
            value={defaultValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChangeFunction(event.target.value);
        }}/>
    )
}

export default Input