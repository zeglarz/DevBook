import React from 'react';
import code from '../../img/code.svg';

function Navbar(props) {
    return (
        <nav className="navbar bg-dark">
            <h1>
                <a href="dashboard.html" className="logo">
                    <img src={code} className="logo" alt=""/> <span>DevBook</span>
                </a>
            </h1>
            <ul>
                <li><a href="profiles.html">Developers</a></li>
                <li><a href="register.html">Register</a></li>
                <li><a href="login.html">Login</a></li>
            </ul>
        </nav>);
}

export default Navbar;

