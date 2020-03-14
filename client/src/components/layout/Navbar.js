import React from 'react';
import { Link } from 'react-router-dom';
import code from '../../img/code.svg';

function Navbar(props) {
    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to='/' className="logo">
                    <img src={code} className="logo" alt=""/> <span>DevBook</span>
                </Link>
            </h1>
            <ul>
                <li><Link to="/profiles">Developers</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
            </ul>
        </nav>);
}

export default Navbar;

