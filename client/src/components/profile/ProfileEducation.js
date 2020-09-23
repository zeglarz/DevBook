import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';


const ProfileEducation = ({ edu: { school, degree, fieldofstudy, to, from, description } }) => {
    return (
        <div>
            <h3 className="text-dark">{school}</h3>
            <p>
                <Moment format='DD/MM/YYYY'>{moment.utc(from)}</Moment> -{' '}
                {!to ? ' Now' : <Moment format='DD/MM/YYYY'>{moment.utc(to)}</Moment>}
            </p>
            <p><strong>Degree: </strong>{degree}</p>
            <p><strong>Field of Study: </strong>{fieldofstudy}</p>
            <p>gi
                <strong>Description: </strong>{description}
            </p>
        </div>);
};

ProfileEducation.propTypes = {
    edu: PropTypes.object.isRequired
};

export default ProfileEducation;
