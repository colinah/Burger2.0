import axios from 'axios';
require('dotenv').config()

import * as actiontypes from './actionTypes';

export const authStart = () => {
    return {
        type: actiontypes.AUTH_START
    };
};

export const authSuccess = (authData) => {
    return {
        type: actiontypes.AUTH_SUCCESS,
        authData: authData
    };
};

export const authFail = (error) => {
    return {
        type: actiontypes.AUTH_SUCCESS,
        error: error
    };
};

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + API_KEY;
        if(!isSignup){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + API_KEY

        }
        console.log(authData)
        axios.post(url, authData)
        .then(response => {
            console.log(response);
            dispatch(authSuccess(response.data));

        })
        .catch(err => {
            console.log(err);
            dispatch(authFail());
        })
    };
};
