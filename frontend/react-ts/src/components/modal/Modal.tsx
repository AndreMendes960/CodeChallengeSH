import React  from 'react';

import styles from "./Modal.module.scss"

type Props ={
    children? : JSX.Element | JSX.Element[]
}

function Modal({children} : Props) {

    return (
      <div className = {styles.modal}>
        {children}
      </div>
    );
  }
  export default Modal;