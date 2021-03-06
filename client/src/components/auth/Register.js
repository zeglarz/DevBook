import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../redux/actions/alert';
import { register } from '../../redux/actions/auth';
import PropTypes from 'prop-types';
import { login } from '../../redux/actions/auth';


const Register = ({ setAlert, login, register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const { name, email, password, password2 } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) {
            setAlert('Passwords do not match', 'danger');
        } else {
            register({ name, email, password });
        }
    };

    if (isAuthenticated) {
        return <Redirect to='/dashboard'/>;
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="text"
                           placeholder="Name"
                           name="name"
                           value={name}
                           onChange={e => onChange(e)}
                           required/>
                </div>
                <div className="form-group">
                    <input type="email"
                           placeholder="Email Address"
                           name="email" value={email}
                           onChange={e => onChange(e)}
                           required/>
                    <small className="form-text">
                        This site uses Gravatar so if you want a profile image, use a
                        Gravatar email
                    </small>
                </div>
                <div className="form-group">
                    <input type="password"
                           placeholder="Password"
                           name="password"
                           minLength="6"
                           value={password}
                           onChange={e => {
                               onChange(e);
                               e.target.value.length > 0 ? setShowConfirmPass(true) : setShowConfirmPass(false);
                           }}
                           required
                    />
                </div>
                {showConfirmPass && <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                        value={password2}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>}
                < input type='submit' className='btn btn-primary' value='Register'/>
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
            <p className="my-1">
                Try out demo <a onClick={() => login('john@doe.com', '123456')}>Demo Account</a>
            </p>
        </Fragment>
    );
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateProps, { setAlert, register, login })(Register);
