import {Dispatch, SetStateAction } from "react";
import { FileUploader } from "react-drag-drop-files";


type Props ={
    setFiles : Dispatch<SetStateAction<File | null>>,
    fileTypes : string[]
}

function DragDrop({ setFiles, fileTypes} : Readonly<Props>) {
  return (
    <FileUploader handleChange={setFiles} name="file" types={fileTypes} />
  );
}

export default DragDrop;