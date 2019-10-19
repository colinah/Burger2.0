import React, { Component } from 'react';
import Aux from '../../../hoc/Aux/Aux'
import Button from '../../UI/Button/Button'

class OrderSummary extends Component {
    render(){
        const ingredientSummary = Object.keys(this.props.ingredients)
        .map((igKey , index) => {
            return <li key = {igKey+index}>
                    <span style= {{textTransform: 'capitalize'}}>{igKey}</span>
                    : {this.props.ingredients[igKey]}
                    </li>
        })
       return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the folling ingredients:</p>
            <ul>
            {ingredientSummary}
            </ul>
            <p><strong>Price: ${this.props.price.toFixed(2)}</strong></p>
            <p>Continue to Checkout?</p>
            <Button btnType='Danger' clicked={this.props.cancel}>CANCEL</Button>
            <Button btnType='Success' clicked={this.props.continue} >CONTINUE</Button>
        </Aux>
       ) 
    }
}

export default OrderSummary