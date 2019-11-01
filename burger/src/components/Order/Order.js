import React from 'react';

import classes from './Order.module.css';
import Button from '../../components/UI/Button/Button';

const order = ( props ) => {
    const ingredients = [];

    for ( let ingredientName in props.ingredients ) {
        ingredients.push(
            {
                name: ingredientName,
                amount: props.ingredients[ingredientName]
            }
        );
    }

    const ingredientOutput = ingredients.map(ig => {
        return <span 
            style={{
                textTransform: 'capitalize',
                display: 'inline-block',
                margin: '0 8px',
                border: '1px solid #ccc',
                padding: '5px'
                }}
            key={ig.name}>{ig.name} ({ig.amount})</span>;
    });

    return (
        <div className={classes.Order}>
            <span>Ingredients: {ingredientOutput}</span>
            <span> Price: <strong>USD {Number.parseFloat( props.price ).toFixed( 2 )} </strong></span>
            <Button style={{paddingLeft: '6px'}} btnType="Danger" > Delete</Button>
        </div>
    );
};

export default order;