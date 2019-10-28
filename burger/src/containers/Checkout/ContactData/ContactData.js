import React , { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        }
    }
    render(){

        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                <form>
                    <input type="text" name="name" placeholder="Your name" />
                    <input type="text" name="email" placeholder="email" />
                    <input type="text" name="street" placeholder="street" />
                    <input type="text" name="zip" placeholder="zip code" />
                    <Button btnType="Success">Order</Button>
                </form>
            </div>
        )
    }
}

export default ContactData;