import React from 'react';
import Alert from '../layout/Alert';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Profile from '../profile/Profile';
import Profiles from '../profiles/Profiles';
import PrivateRoute from './PrivateRoute';
import Dashboard from '../dashboard/Dashboard';
import CreateProfile from '../profile-form/CreateProfile';
import EditProfile from '../profile-form/editProfile';
import AddExperience from '../profile-form/AddExperience';
import AddEducation from '../profile-form/AddEducation';
import Posts from '../posts/Posts';
import PostForm from '../posts/PostForm';
import Post from '../post/Post';
import NotFound from '../layout/NotFound';

const Routes = (props) => {
    return (
        <section className="container">
            <Alert/>
            <Switch>
                <Route exact path='/register' component={Register}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/profile/:id' component={Profile}/>
                <Route exact path='/profiles' component={Profiles}/>
                <PrivateRoute exact path='/dashboard' component={Dashboard}/>
                <PrivateRoute exact path='/create-profile' component={CreateProfile}/>
                <PrivateRoute exact path='/edit-profile' component={EditProfile}/>
                <PrivateRoute exact path='/add-experience' component={AddExperience}/>
                <PrivateRoute exact path='/add-education' component={AddEducation}/>
                <PrivateRoute exact path='/posts' component={Posts}/>
                <PrivateRoute exact path='/post-form' component={PostForm}/>
                <PrivateRoute exact path='/posts/:id' component={Post}/>
                <Route component={NotFound}/>
            </Switch>
        </section>
    );
};

export default Routes;
