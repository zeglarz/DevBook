import React from 'react';

function Landing(props) {
    return (
        <section className="landing">
            <div className="dark-overlay">
                <div className="landing-inner">
                    <h1 className="x-large">DevBook</h1>
                    <p className="lead">Create developer profile/portfolio, share posts and get help from other
                        developers</p>
                    <div className="buttons">
                        <a href="register.html" className="btn btn-primary">Sign Up</a>
                        <a href="login.html" className="btn">Login</a>
                    </div>
                </div>
            </div>
        </section>);
}

export default Landing;
