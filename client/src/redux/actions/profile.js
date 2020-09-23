import axios from 'axios';
import { setAlert } from './alert';
import {
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_PROFILE,
    GET_PROFILES,
    GET_REPOS,
    PROFILE_ERROR,
    UPDATE_PROFILE
} from './types';
import server from '../../production.json';

// Get current users profile

export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get(`${server.serverURL}/api/profile/me`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: err.response && {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
};

// Get all profiles
export const getProfiles = () => async dispatch => {
    dispatch({ type: CLEAR_PROFILE });

    try {
        const res = await axios.get(`${server.serverURL}/api/profile`);

        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: err.response && { msg: err.response.statusText, status: err.response.status }
        });
    }
};
// Get profile by id
export const getProfileById = userId => async dispatch => {
    try {
        const res = await axios.get(`${server.serverURL}/api/profile/user/${userId}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};
// Get GitHub repos
export const getGithubRepos = username => async dispatch => {

    try {
        const res = await axios.get(`${server.serverURL}/api/profile/github/${username}`);

        dispatch({
            type: GET_REPOS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Create or update profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const res = await axios.post(`${server.serverURL}/api/profile`, formData, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

        if (!edit) {
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Add Experience

export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const res = await axios.put(`${server.serverURL}/api/profile/experience`, formData, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Experience Added', 'success'));

        history.push('/dashboard');

    } catch (err) {
        const errors = err.response && err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: err.response && { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Add Education

export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const res = await axios.put(`${server.serverURL}/api/profile/education`, formData, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Education Added', 'success'));

        history.push('/dashboard');

    } catch (err) {
        const errors = err.response && err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: err.response && { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Delete Experience

export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`${server.serverURL}api/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Experience Removed', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: err.response && { msg: err.response.statusText, status: err.response.status }
        });
    }
};
// Delete Education

export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`${server.serverURL}/api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Education Removed', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: err.response &&  { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Delete account & profile

export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure? The account will be irrevocably removed!')) {
        try {
            await axios.delete(`${server.serverURL}/api/profile`);

            dispatch({ type: CLEAR_PROFILE });
            dispatch({ type: ACCOUNT_DELETED });
            dispatch(setAlert('Account Removed'));

        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }
    }
};
