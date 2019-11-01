import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route , Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import ContactData from './ContactData/ContactData';
class Checkout extends Component {
    state = {
        ingredients: null,
        totalPrice: 0
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    };

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data')
    };

    render(){
        let summary = <Redirect to="/" />
        if (this.props.ings) {
            const purchaseRedirect = this.props.purchased ? <Redirect to="/" /> : null
            summary = (
                <CheckoutSummary  
                    ingredients = { this.props.ings }
                    checkoutCancelled = { this.checkoutCancelledHandler }
                    checkoutContinued = { this.checkoutContinuedHandler }
                />);
        }
        return(
            <div>
                {summary}
                <Route 
                    path={this.props.match.path + "/contact-data"} 
                    component = {ContactData} />
                
            </div>
        )
    }
};

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }

}


export default connect(mapStateToProps)(Checkout);