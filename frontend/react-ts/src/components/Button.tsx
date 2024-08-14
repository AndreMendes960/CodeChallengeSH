import { Button } from 'primereact/button';

type Props = {
    eventHandler : () => void
    label : string,
    link? : boolean,
    size? : "small" | "large" | undefined
    type? : "submit" | "reset" | "button" | undefined
}

const CustomButton = ({label, eventHandler, link, size = "small", type = "button"} : Props) => {
    return (
        <Button label={label} link={link} size={size} onClick={eventHandler} type={type}/>
    );
}

export default CustomButton;