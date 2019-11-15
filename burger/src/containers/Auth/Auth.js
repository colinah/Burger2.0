import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom'
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import { updateObject } from '../../shared/utility';



class Auth extends Component {
state = {
    controls: {
        email: {
            elementType: 'input',
            elementConfig: {
                type:'text',
                placeholder: 'Email'
            },
            value: '',
            validation: {
                require: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type:'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                require: true,
                minLength: 6
            },
            valid: false,
            touched: false
        }
    },
    isSignup: true
    
}
    componentDidMount() {
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/'){
            this.props.onSetAuthRedirectPath()
        }
    }
    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignup: !prevState.isSignup}
        })
    }

    checkValidationHandler(value,rules){
        let isValid = true;
        if(!rules) {
            return true;
        }
        if(rules.require) {
            isValid = value.trim() !== '' && isValid;
        }
        if(rules.minLength) {
            isValid = value.length >= rules.minLength  && isValid;
        }
        if(rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        if(rules.isEmail) { 
            //eslint-disable-next-line
            const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            isValid = pattern.test(value) && isValid;
        }
        return isValid;
    }

    inputChangeHandler = (event , controlName) => {
        const updatedControls = updateObject(this.state.controls,{
            [controlName]: updateObject(this.state.controls[controlName],{
                value: event.target.value,
                valid: this.checkValidationHandler(event.target.value, this.state.controls[controlName].validation),
                touched: true
            })
        });
        this.setState({controls: updatedControls});
    };

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value,this.state.controls.password.value,this.state.isSignup);
    } 

    render(){
        const formElementsArray = [];
        for(let key in this.state.controls) {
            formElementsArray.push({
                id:key,
                config: this.state.controls[key]
            })
        }

        let form =  formElementsArray.map(formElement => (
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
        ))
        if(this.props.loading){
            form = (
                <Spinner />
            )
        }
        let errorMessage = null;
        if(this.props.error){
            errorMessage = <p>{this.props.error.message}</p>
        }
        let redirect = null
        if(this.props.isAuthenticated){
            redirect = <Redirect to={this.props.authRedirectPath} />
        }
        return (
            <div className={classes.Auth}> 
            {redirect}
                <h4>{this.state.isSignup ? 'SIGN UP' : 'LOGIN'}</h4>
                {errorMessage}
                <form onSubmit = {this.submitHandler}>
                    {form}
                    <Button btnType = "Success" style={{marginRight:'10px'}}>SUBMIT</Button>    
                </form>

                <Button 
                        clicked = {this.switchAuthModeHandler}
                        btnType = "Success"
                        style={{marginLeft:'10px'}}
                        >{this.state.isSignup ? 'LOGIN' : 'SIGNIN'}</Button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }

}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email,password, isSignup) => dispatch(actions.auth(email,password, isSignup)),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
};

export default connect(mapStateToProps , mapDispatchToProps)(Auth);