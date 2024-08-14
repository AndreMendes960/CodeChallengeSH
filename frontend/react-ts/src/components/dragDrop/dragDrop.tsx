import {Dispatch, SetStateAction } from "react";
import { FileUploader } from "react-drag-drop-files";


type Props ={
    setFiles : Dispatch<SetStateAction<File | null>>,
    fileTypes : string[]
}

function DragDrop({ setFiles, fileTypes} : Readonly<Props>) {
  return (
    <FileUploader label="Upload or Drop a file. Only one at a time." handleChange={setFiles} name="file" types={fileTypes} />
  );
}

export default DragDrop;