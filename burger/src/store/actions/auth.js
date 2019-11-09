import axios from 'axios';
import * as actiontypes from './actionTypes';
 

export const authStart = () => {
    return {
        type: actiontypes.AUTH_START
    };
};

export const authSuccess = (idToken , userId) => {
    return {
        type: actiontypes.AUTH_SUCCESS,
        idToken: idToken,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actiontypes.AUTH_SUCCESS,
        error: error
    };
};

export const logout = () => {
    return {
        type:actiontypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (experationTime) => {
    return dispatch => {
        setTimeout(()=> {
            dispatch(logout())
        },experationTime * 1000);
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
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCjy4DlV0ZL7eBCvrQGEEKWuEeJBU8Ttgw';
        if(!isSignup){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCjy4DlV0ZL7eBCvrQGEEKWuEeJBU8Ttgw'

        }
        console.log(authData)
        axios.post(url, authData)
        .then(response => {
            console.log(response);
            dispatch(authSuccess(response.data.idToken , response.data.localId));
            dispatch(checkAuthTimeout(response.data.expiresIn))
        })
        .catch(err => {
            dispatch(authFail(err.response.data.error))
        })
    };
};
