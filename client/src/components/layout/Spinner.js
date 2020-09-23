import React from 'react';
import { css } from '@emotion/core';
import BeatLoader from 'react-spinners/BeatLoader';

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 32vh 40%;
  border-color: red;
`;

const Spinner = (props) => {

    return (
        <div className="sweet-loading">
            <BeatLoader
                css={override}
                size={20}
                color={'#36D7B7'}
                loading='true'
            />
        </div>
    );

};

export default Spinner;
