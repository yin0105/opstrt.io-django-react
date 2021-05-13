import axios from 'axios';
import * as actionTypes from './actionTypes';
import { history } from "../../../history"

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, username) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        username: username
    }
}

export const authFail = error => {
    let message = error.message ?
        typeof error.response.data === "object" ?
        Object.values(error.response.data).join('\n') :
        error.response.data.message :
        error.request._response;
    console.log(error.response)
    return {
        type: actionTypes.AUTH_FAIL,
        error: message
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    }
}

export const authLogin = (username, password) => {
    return dispatch => {

        dispatch(authStart());
        return axios.post('https://openstreet.io/rest-auth/login/', {
                username: username,
                password: password
            })
            .then(res => {
                const token = res.data.key;
                const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
                localStorage.setItem('token', token);
                localStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(token, username));
                dispatch(checkAuthTimeout(3600));
                history.push('/dashboard');
            })
            .catch(err => {
                return dispatch(authFail(err));
            })

    }
}

export const fetchArticles = () => {
    return dispatch => {
        axios.get(`https://openstreet.io/api/matrix/?action=search`)
            .then(res => {
                localStorage.setItem('rowData', res.data);
            });
    }
}

export const authSignup = (username, email, password1, password2) => {
    
    return dispatch => {
        dispatch(authStart());
        return axios.post('https://openstreet.io/rest-auth/registration/', {
                username: username,
                email: email,
                password1: password1,
                password2: password2
            })
            .then(res => {
                const token = res.data.key;
                const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
                localStorage.setItem('token', token);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('hasError', false);
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout(3600));
                history.push('/login');
            })
            .catch(err => {
                return dispatch(authFail(err))

            })

    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (token === undefined) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            }
        }
    }
}
