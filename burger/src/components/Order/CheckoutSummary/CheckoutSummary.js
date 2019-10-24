import React from 'react';
import classes from './CheckoutSummary.css'
import Burger from '../../Burger/Burger';
import Button from '../../../components/UI/Button/Button';

const checkoutSummary = (props) => {
    return (
        <div className={classes.CheckoutSummary}>
            <h1>We hope it tastes well!</h1>
            <div style={{width: '100%', margin: 'auto'}}>
                <Burger ingredients={props.ingredients} />
            </div>
            <Button btnType="Danger">CANCEL</Button>
            <Button btnType="Success">CONTINUE</Button>
        </div>
    )
}

export default checkoutSummary;