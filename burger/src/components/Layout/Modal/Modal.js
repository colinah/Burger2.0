import React from 'react';
import classes from './Modal.module.css';
import Aux from '../../../hoc/Aux';
import Backdrop from '../BackDrop/BackDrop';

const modal = (props) => (
    <Aux>
    <div className={classes.Modal}
        style ={{
            transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: props.show ? 1 : 0 
        }}>
        {props.children}
    </div>
    <Backdrop 
        show = {props.show}
        purchasing = {props.purchasing} />
    </Aux>
)

export default modal;