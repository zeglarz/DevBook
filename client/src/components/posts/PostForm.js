import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../redux/actions/post';

const PostForm = ({ addPost }) => {
    const [text, setText] = useState('');
    const [showPostField, setShowPostField] = useState(false);
    return (
        <Fragment>
            <button className="btn"
                    onClick={() => {
                        setShowPostField(!showPostField);
                        setText('');
                    }}> {showPostField ? 'Hide Add Post Form' : 'Add Post'}
            </button>
            {showPostField &&
            <div className="post-form">
                <div className="bg-primary p">
                    <h3>Say Something...</h3>
                </div>
                <form className="form my-1" onSubmit={e => {
                    e.preventDefault();
                    addPost({ text });
                    setText('');
                    setShowPostField(false);
                }}>
          <textarea
              name="text"
              cols="30"
              rows="5"
              placeholder="Create a post"
              value={text}
              onChange={e => setText(e.target.value)}
              required>
          </textarea>
                    <input type="submit" className="btn btn-dark my-1" value="Submit"/>
                </form>
            </div>}
        </Fragment>);
};

PostForm.propTypes = {
    addPost: PropTypes.func.isRequired
};

export default connect(null, { addPost })(PostForm);
