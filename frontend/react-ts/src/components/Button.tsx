import { Button } from 'primereact/button';

type Props = {
    eventHandler : ()=>void,
    label : string,
    link? : boolean
}

const CustomButton = ({label, eventHandler, link} : Props) => {
    return (
        <Button label={label} link={link} onClick={eventHandler}/>
    );
}

export default CustomButton;