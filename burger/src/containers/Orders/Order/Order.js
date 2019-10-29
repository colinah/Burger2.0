import React from 'react';
import classes from './Order.module.css'

const order = (props) => (
    <div className= {classes.Order}>
        <h6>Ingredients </h6>
        <p> Price: <strong>USD {props.price.toFixed(2)}</strong></p>
    </div>
)

export default order;