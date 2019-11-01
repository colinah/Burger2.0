import React , { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'Name'
                },
                value: '',
                validation: {
                    require: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    require: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'Zip Code'
                },
                value: '',
                validation: {
                    require: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    require: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type:'email',
                    placeholder: 'Email'
                },
                value: '',
                validation: {
                    require: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'},

                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true,
            }
        },
        formIsValid: false,
    }

    orderHandler = (event) => {
        event.preventDefault()
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
        }
        // axios.post('/orders.json', order)
        //     .then(response => {
        //         this.props.history.push('/')
        //     })
        //     .catch(error => {

        //     })
        this.props.onOrderBurger(order);
    }

    checkValidationHandler(value,rules){
        let isValid = true;
        if(!rules) {
            return true;
        }
        if(rules.require){
            isValid = value.trim() !== '' && isValid;
        }
        if(rules.minLength){
            isValid = value.length >= rules.minLength  && isValid;
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }

    inputChangeHandler = (event,inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        }
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        }
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidationHandler(updatedFormElement.value,updatedFormElement.validation)
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({orderForm:updatedOrderForm, formIsValid: formIsValid});
    }

    render(){
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
                <form onSubmit={this.orderHandler}>
                    {formElementsArray.map(formElement => (
                        <Input 
                            key = {formElement.id}
                            invalid = {!formElement.config.valid}
                            shouldValidate = {formElement.config.validation}
                            touched = {formElement.config.touched}
                            elementType = {formElement.config.elementType}
                            elementConfig = {formElement.config.elementConfig}
                            value = {formElement.config.value}
                            change = {(event) => this.inputChangeHandler(event, formElement.id)}
                        />
                    ))}
                    
                    <Button 
                        btnType="Success"
                        clicked={this.orderHandler}
                        disabled={!this.state.formIsValid}
                    >Order</Button>
                </form>
        );
        if(this.props.loading){
            form = <Spinner />
        }

        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData) => dispatch(actions.purchaseBurger(orderData))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));